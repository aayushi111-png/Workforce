# LOOPHOLES & FIXES — Implementation Guide

---

## 🔴 CRITICAL FIXES (Must Implement)

---

### **FIX #1: Duplicate Worker Email Prevention**

**Problem:** Two workers with same email = login broken

**Where to add:** 02-FEATURES.md (Worker Creation), 03-DATABASE.md (Schema), 05-TECH-STACK.md (Backend)

**Changes needed:**

#### A. Backend Validation (FastAPI)
```python
# POST /api/workers (create worker endpoint)

@app.post("/api/workers")
async def create_worker(request: WorkerCreate):
    # Check if email already exists
    existing = db.collection('workers').where('email', '==', request.email).get()
    
    if existing:
        return {"error": "Email already registered", "status": 409}
    
    # Check Zoho webhook too
    existing_zoho = db.collection('workers').where(
        'source', '==', 'zoho'
    ).where('email', '==', request.email).get()
    
    if existing_zoho:
        return {"error": "Worker already created from Zoho", "status": 409}
    
    # If passes both checks, create worker
    worker = create_new_worker(request)
    return worker
```

#### B. Database Schema Constraint
```
Add to Firestore workers collection:
├─ Add index: email (unique) ← Force unique emails
├─ Or: Add constraint in backend (check before write)
└─ Audit log: "Email check passed, worker created"
```

#### C. Zoho Webhook Handler
```python
@app.post("/api/zoho/worker-created")
async def zoho_webhook(data: ZohoWebhook):
    # Check if worker already exists
    existing = db.collection('workers').where('email', '==', data.email).get()
    
    if existing:
        # Log conflict but don't create duplicate
        log_audit("zoho_duplicate_prevented", {
            "email": data.email,
            "zoho_id": data.candidate_id,
            "reason": "Email already exists"
        })
        return {"status": "skipped", "reason": "Duplicate email"}
    
    # Safe to create
    create_worker_from_zoho(data)
```

#### D. Update Spec
**Add to 02-FEATURES.md (Worker Creation section):**
```
**Duplicate Prevention:**
- System checks if email already exists (manual or Zoho)
- If exists: Shows error "Email already registered"
- Manual creation: HR retries with different email
- Zoho webhook: Logs conflict, skips duplicate, alerts HR

**Validation:**
1. Email format check: Must be @katbotz.com
2. Duplicate check: Query all workers by email
3. Case-insensitive: rohan@katbotz.com = ROHAN@katbotz.com (same)
```

---

### **FIX #2: Invoices for Exited Contractors**

**Problem:** Invoice submitted before exit date, auto-deleted 3 years later. Unpaid contractor.

**Where to add:** 02-FEATURES.md (Invoices), 04-WORKFLOWS.md, 03-DATABASE.md

**Changes needed:**

#### A. Workflow Change
```
NEW WORKFLOW: Exit with Pending Invoices

Step 1: HR marks contractor for exit
├─ System checks: Any unpaid invoices?
├─ If YES → Show warning: "3 pending invoices. Approve/reject before exit"
└─ If NO → Proceed to exit

Step 2: Complete All Invoices
├─ HR must: Approve or reject each invoice before exit date
├─ Cannot exit until all invoices have status (Paid, Rejected, or Disputed)
└─ If deadline missed: System prevents auto-delete, requires manual review

Step 3: Mark Exit
├─ All invoices must have final status
├─ Only then can HR click [Mark for Exit]
└─ System sets: Delete date = exit_date + 3 years
```

#### B. Database Schema Change
```
Add to invoices collection:
├─ contractor_exit_date: date (when contractor exiting)
├─ final_status: "paid" | "rejected" | "disputed" | "pending" (locked on exit)
├─ must_resolve_before: date (exit_date, if invoice pending)
└─ archived_after_exit: true/false (if archived separately)

Add to offboarding collection:
├─ pending_invoices_count: number
├─ invoices_resolved: true/false (must be true before delete)
└─ last_invoice_resolution_date: date
```

#### C. Backend Logic
```python
@app.put("/api/workers/{id}/offboarding/mark-exit")
async def mark_exit(worker_id: str, exit_date: date):
    # Check for pending invoices
    pending = db.collection('invoices').where(
        'contractor_id', '==', worker_id
    ).where('status', '==', 'submitted').get()
    
    if pending:
        return {
            "error": "Cannot exit with pending invoices",
            "pending_count": len(pending),
            "message": f"Approve/reject {len(pending)} invoices first",
            "action": "Redirect to /invoices?contractor_id={worker_id}"
        }
    
    # All invoices resolved, proceed to exit
    mark_for_exit(worker_id, exit_date)
    set_delete_date(worker_id, exit_date + 3_years)
```

#### D. Auto-Delete Protection
```python
# Daily auto-delete job
@scheduled_job('cron', hour=1, minute=0)
def auto_delete_job():
    exited_workers = get_workers_marked_exit()
    
    for worker in exited_workers:
        if worker.delete_date <= today:
            # Check: Are all invoices final status?
            invoices = db.collection('invoices').where(
                'contractor_id', '==', worker.id
            ).get()
            
            for invoice in invoices:
                if invoice.status == 'submitted':
                    # STOP: Don't delete, alert HR
                    send_alert(f"Cannot delete {worker.name}: Invoice {invoice.id} still pending")
                    log_audit("auto_delete_blocked_pending_invoice", worker.id)
                    return
            
            # All invoices resolved, safe to delete
            delete_worker_data(worker)
```

#### E. Update Spec
**Add to 02-FEATURES.md (Offboarding section):**
```
**Contractor Exit Process:**
- HR marks for exit
- System lists all unpaid invoices
- HR must approve/reject each invoice
- Cannot exit until invoices resolved
- Audit trail: Invoice resolution before deletion
- If invoice unresolved at delete time: Auto-delete blocked, HR notified
```

---

### **FIX #3: Audit Trail Immutability (Even for Founder)**

**Problem:** Founder has "full authority" = can delete audit logs

**Where to add:** 07-SECURITY.md, 02-FEATURES.md, 05-TECH-STACK.md

**Changes needed:**

#### A. Database Schema (Firestore)
```
audit_logs collection:
├─ immutable: true (CANNOT be modified or deleted)
├─ append_only: true (only new entries added)
├─ retention: "FOREVER" (never auto-deleted)
├─ access_control:
│  ├─ Founder: READ-ONLY (view all)
│  ├─ HR: READ-ONLY (view own)
│  └─ System: APPEND-ONLY (add entries)
├─ permissions:
│  ├─ DELETE: BLOCKED (nobody)
│  ├─ MODIFY: BLOCKED (nobody)
│  └─ READ: Allowed (based on role)
└─ backup_immutable: true (backups also immutable)
```

#### B. Backend Validation
```python
# Block ANY attempt to modify audit logs
@app.delete("/api/audit-logs/{id}")
async def delete_audit_log(log_id: str):
    return {"error": "Audit logs are immutable", "status": 403}

@app.put("/api/audit-logs/{id}")
async def update_audit_log(log_id: str, data: dict):
    return {"error": "Audit logs are immutable", "status": 403}

@app.patch("/api/audit-logs/{id}")
async def patch_audit_log(log_id: str, data: dict):
    return {"error": "Audit logs are immutable", "status": 403}

# Only CREATE is allowed
@app.post("/api/audit-logs")
async def create_audit_log(entry: AuditEntry):
    # Only system can add (no user-triggered creation)
    if request.user_role != "system":
        return {"error": "Only system can create audit entries", "status": 403}
    
    # Add entry, never delete
    save_audit_log(entry)
```

#### C. Firestore Rules
```
match /audit_logs/{document=**} {
  // Only appending allowed
  allow write: if request.method == 'create' && isSystem();
  
  // No delete, no update
  allow delete: if false;
  allow update: if false;
  
  // Read based on role
  allow read: if isFounder() || (isHR() && isOwnAction());
}
```

#### D. Update Spec
**Replace in 07-SECURITY.md (Audit Trail section):**
```
**Audit Trail Immutability (CRITICAL):**

No one can modify or delete audit logs, even Founder:
├─ DELETE blocked: System returns 403 Forbidden
├─ UPDATE blocked: System returns 403 Forbidden
├─ MODIFY blocked: System returns 403 Forbidden
├─ APPEND allowed: Only system can add entries
└─ READ allowed: Founder (all), HR (own actions)

Why?
├─ Legal compliance: DPDP Act requires tamper-proof logs
├─ Litigation proof: Logs show what happened
├─ Founder authority: Full access ≠ can delete proof
└─ Policy: Even Founder subject to audit trail constraints

Founder capabilities REMAIN:
├─ View ALL audit logs (nobody else can)
├─ Export audit reports
├─ Query by date, user, worker
├─ BUT: Cannot modify, delete, or hide logs
```

---

### **FIX #4: Multi-Currency Rate Lock**

**Problem:** Exchange rate changes mid-contract, contract becomes ambiguous

**Where to add:** 03-DATABASE.md, 02-FEATURES.md (Contracts), 04-WORKFLOWS.md

**Changes needed:**

#### A. Database Schema Change
```
contracts collection (add fields):
├─ salary_currency: "INR" | "USD" | "EUR" (locked at creation)
├─ salary_amount: 50000 (locked)
├─ salary_effective_date: "2026-06-01" (locked - contract start date)
├─ salary_rate_version: 1 (locked - original is v1)
│
├─ amendments: [
│  {
│    amendment_id: "amend-001",
│    amendment_date: "2026-09-01",
│    version: 2,
│    changes: {
│      salary_amount: { before: 50000, after: 55000 },
│      change_reason: "Performance increase"
│    },
│    approved_by: "founder@katbotz.com",
│    approved_date: "2026-09-01"
│  }
│ ]
│
└─ current_version: 2 (points to latest amendment or original)
```

#### B. Workflow Change (Amendments)
```
NEW: Contract Amendment Process

Step 1: HR/Founder identifies change needed
├─ Examples: Salary increase, scope change, duration extension
└─ Click [Create Amendment]

Step 2: System captures:
├─ What changed: salary 50k → 55k
├─ Effective date: 2026-09-01
├─ Reason: "Performance increase"
├─ Version: 2 (auto-incremented)
└─ Status: "Draft" (not yet approved)

Step 3: Founder approves amendment
├─ Reviews old vs new terms
├─ Clicks [Approve Amendment]
├─ System locks: Original contract (immutable)
├─ System creates: Amendment v2 (new version)
└─ Audit log: "Amendment v2 approved"

Step 4: Contractor sees notification
├─ Message: "Contract updated - Salary now ₹55,000"
├─ Can view: Original contract + all amendments
└─ Historical view: What was the rate on June 1?
```

#### C. Backend Logic
```python
@app.post("/api/contracts/{id}/amend")
async def create_amendment(contract_id: str, amendment: Amendment):
    # Get original contract (immutable)
    contract = db.collection('contracts').document(contract_id).get()
    
    # Create NEW amendment (version++, locked)
    new_version = contract.current_version + 1
    amendment.version = new_version
    amendment.effective_date = amendment.effective_date  # User specifies
    amendment.created_date = today()
    amendment.status = "pending_approval"
    
    # Store amendment separately (linked to contract)
    db.collection('contract_amendments').add({
        'contract_id': contract_id,
        'version': new_version,
        'changes': amendment.changes,
        'status': 'pending_approval'
    })
    
    # Update contract pointer (current_version stays same until approved)
    return {"amendment_id": amendment.id, "status": "pending_approval"}

@app.post("/api/contracts/{id}/amendments/{amend_id}/approve")
async def approve_amendment(contract_id: str, amendment_id: str):
    # Only Founder can approve
    if request.user_role != "founder":
        return {"error": "Only Founder can approve amendments", "status": 403}
    
    amendment = get_amendment(amendment_id)
    amendment.status = "approved"
    amendment.approved_date = today()
    amendment.approved_by = request.user_email
    
    # Update contract.current_version → new amendment
    contract = db.collection('contracts').document(contract_id)
    contract.update({'current_version': amendment.version})
    
    # Audit log
    log_audit("contract_amendment_approved", {
        "contract_id": contract_id,
        "version": amendment.version,
        "changes": amendment.changes
    })
```

#### D. Invoice/Gusto Sync Uses Current Version
```python
# When syncing to Gusto, always use current_version
contract = get_contract(contractor_id)
current_amendment = get_amendment_by_version(contract.current_version)

# Get salary from current version
if current_amendment:
    salary = current_amendment.changes.salary_amount.after
else:
    salary = contract.salary_amount  # Original

# Sync to Gusto with locked rate
sync_to_gusto({
    "employee_id": contractor_id,
    "salary": salary,
    "effective_date": current_amendment.effective_date,
    "rate_version": current_amendment.version
})
```

#### E. Update Spec
**Add to 02-FEATURES.md (Contract Management):**
```
**Contract Amendment System:**

Original Contract (v1) - LOCKED:
├─ Salary: ₹50,000/month
├─ Effective: June 1, 2026
├─ Cannot be edited (immutable)
└─ Source of truth if no amendments

Amendment (v2, v3, etc.) - NEW RECORDS:
├─ What changed: Salary 50k → 55k
├─ Effective: September 1, 2026
├─ Approved by: Founder
├─ Audit trail: All versions tracked
└─ Current version: Points to latest (or original if no amendments)

When salary changes apply:
├─ Invoice on June 1? Use v1 (50k)
├─ Invoice on Sept 1? Use v2 (55k)
├─ No retroactive changes
└─ Audit trail shows rate used

Gusto sync uses:
├─ Current contract version
├─ Effective date from amendment
├─ Locked rate (cannot change mid-invoice)
```

---

### **FIX #5: Zoho Webhook Retry Logic**

**Problem:** If webhook fails, worker never created. No retry.

**Where to add:** 05-TECH-STACK.md, 04-WORKFLOWS.md, 02-FEATURES.md

**Changes needed:**

#### A. Database Schema
```
zoho_webhooks collection (new):
├─ webhook_id: "zoho-123456"
├─ candidate_id: "z-candidate-001"
├─ candidate_email: "rohan@katbotz.com"
├─ received_at: timestamp
├─ status: "received" | "processing" | "success" | "failed"
├─ error_message: null (if success) or "error text"
├─ retry_count: 0
├─ next_retry_at: null
├─ created_worker_id: "worker-001" (if successful)
└─ audit_log_id: "log-123" (link to audit trail)
```

#### B. Webhook Handler with Retry
```python
@app.post("/api/zoho/worker-created")
async def zoho_webhook(data: ZohoWebhook):
    # Step 1: Log receipt immediately
    webhook_record = {
        'webhook_id': generate_id(),
        'candidate_id': data.candidate_id,
        'received_at': now(),
        'status': 'received'
    }
    webhook_doc = db.collection('zoho_webhooks').add(webhook_record)
    
    try:
        # Step 2: Validate
        if not data.email.endswith('@katbotz.com'):
            raise ValueError(f"Invalid email domain: {data.email}")
        
        if not data.candidate_name or not data.position:
            raise ValueError("Missing required fields")
        
        # Step 3: Check duplicate
        existing = db.collection('workers').where(
            'email', '==', data.email
        ).get()
        if existing:
            raise ValueError(f"Worker already exists: {data.email}")
        
        # Step 4: Create worker
        worker = {
            'name': data.candidate_name,
            'email': data.email,
            'type': data.employment_type,
            'department': data.department,
            'joining_date': data.joining_date,
            'source': 'zoho',
            'zoho_id': data.candidate_id
        }
        created = db.collection('workers').add(worker)
        
        # Step 5: Success - update webhook record
        webhook_doc.update({
            'status': 'success',
            'created_worker_id': created.id,
            'error_message': None
        })
        
        # Step 6: Audit log
        log_audit("zoho_worker_created", {
            'zoho_id': data.candidate_id,
            'worker_id': created.id,
            'email': data.email
        })
        
        # Return 200 OK (tells Zoho: receipt confirmed)
        return {"status": "success", "worker_id": created.id}
    
    except Exception as e:
        # Step 7: Failed - log error
        webhook_doc.update({
            'status': 'failed',
            'error_message': str(e),
            'retry_count': 0,
            'next_retry_at': add_hours(now(), 1)  # Retry in 1 hour
        })
        
        log_audit("zoho_webhook_failed", {
            'zoho_id': data.candidate_id,
            'error': str(e),
            'retry_scheduled': True
        })
        
        # IMPORTANT: Return 200 OK anyway (tells Zoho: we got it)
        # We'll retry internally
        return {"status": "queued_for_retry", "error": str(e)}

# Scheduled job: Retry failed webhooks
@scheduled_job('cron', hour='*', minute=0)  # Every hour
async def retry_failed_zoho_webhooks():
    failed = db.collection('zoho_webhooks').where(
        'status', '==', 'failed'
    ).where('next_retry_at', '<=', now()).get()
    
    for webhook in failed:
        if webhook.retry_count >= 3:
            # Max retries exceeded
            log_audit("zoho_webhook_abandoned", {
                'zoho_id': webhook.candidate_id,
                'retries': 3,
                'action': 'Manual review required'
            })
            send_alert(f"Zoho webhook failed 3x: {webhook.candidate_id}")
            continue
        
        try:
            # Reconstruct webhook data and retry
            data = ZohoWebhook(
                candidate_id=webhook.candidate_id,
                candidate_name=webhook.candidate_name,
                email=webhook.candidate_email,
                position=webhook.position,
                department=webhook.department,
                joining_date=webhook.joining_date,
                employment_type=webhook.employment_type
            )
            
            # Retry
            result = await zoho_webhook(data)
            webhook.update({'status': 'success'})
            
        except Exception as e:
            webhook.update({
                'retry_count': webhook.retry_count + 1,
                'error_message': str(e),
                'next_retry_at': add_hours(now(), 2 ** webhook.retry_count)  # Exponential backoff
            })
```

#### C. HR Dashboard for Failed Webhooks
```
NEW SECTION: Settings → Integrations → Zoho Status

Pending Zoho Workers (Failed/Retrying):
├─ Candidate: Rohan Mehta
├─ Email: rohan@katbotz.com
├─ Status: Failed (Retry 2/3)
├─ Error: "Invalid email domain"
├─ Next retry: 2:00 PM
├─ Actions: [Manual Create] [Retry Now] [View Webhook Log]

HR can:
├─ Click [Manual Create] → Create worker directly
├─ Click [Retry Now] → Manually trigger retry
├─ Click [View Log] → See error details
```

#### D. Update Spec
**Add to 02-FEATURES.md (Zoho Integration):**
```
**Zoho Webhook Reliability:**

Receipt & Acknowledgment:
├─ WOP receives webhook → Logs immediately
├─ Returns 200 OK (tells Zoho: got it)
├─ Processing happens asynchronously

Validation:
├─ Email must be @katbotz.com
├─ Required fields: name, email, position, type
├─ Duplicate check: Email not already in WOP

If Creation Fails:
├─ Error logged in Firestore
├─ Scheduled retry: 1 hour, then 2, 4, 8 hours (exponential)
├─ Max retries: 3 attempts
├─ If all fail: HR notified, shows in dashboard

HR Recovery Options:
├─ [Manual Create Worker] button → Create immediately
├─ [Retry Now] button → Trigger immediate retry
├─ [View Webhook Log] → See error details and history
├─ Audit trail: All attempts logged
```

---

### **FIX #6: Global Contractor Tax Forms**

**Problem:** W-4 form (required for US payroll) not mentioned

**Where to add:** 01-OVERVIEW.md, 02-FEATURES.md, 03-DATABASE.md

**Changes needed:**

#### A. Update Worker Types Table
**Modify 01-OVERVIEW.md:**
```
| Type | Docs Required | Gusto | Invoices | Student ID | Contracts | Tax Forms |
|------|-----------|-------|----------|-----------|-----------|-----------|
| **Global Contractor** | Tax ID, Agreement, Bank, **W-4** | US Only | YES | NO | YES | **US: W-4** |
| **Global Intern** | Tax ID, Passport, Degree, 10/12, Student ID | US Only | NO | YES | NO | **US: W-4** |
```

#### B. Document Requirements by Location
**Add to 02-FEATURES.md (Documents section):**
```
**Document Requirements by Worker Type & Location:**

Global Contractor (US):
├─ Tax ID (required)
├─ Agreement (required)
├─ Bank proof (required)
├─ W-4 form (IRS required - CRITICAL)
└─ Valid: 1 year, must renew before expiry

Global Contractor (Non-US):
├─ Tax ID (required)
├─ Agreement (required)
└─ Bank proof (required)

Global Intern (US):
├─ Tax ID (required)
├─ Passport (required)
├─ Degree (required)
├─ 10/12 marksheet (required)
├─ Student ID (required)
├─ W-4 form (IRS required if paid - CRITICAL)
└─ Valid: 1 year, must renew

Global Intern (Non-US):
├─ Tax ID (required)
├─ Passport (required)
├─ Degree (required)
├─ 10/12 marksheet (required)
└─ Student ID (required)
```

#### C. Database Schema Change
```
workers collection (add for US contractors/interns):
├─ location: "US" | "India" | "EU" | etc.
├─ requires_w4: true/false (auto-set if US location)
│
documents collection (add):
├─ document_type: "w4" (new)
├─ status: "pending" | "under_review" | "verified" | "expired"
├─ expires_at: date (12 months from verification)
├─ renewal_alert_sent: false (auto-alert at 30 days before expiry)
├─ verified_by: "priya@katbotz.com"
├─ verified_date: "2026-06-23"
```

#### D. Validation Logic
```python
# When creating US contractor/intern
@app.post("/api/workers")
async def create_worker(request: WorkerCreate):
    worker = Worker(**request.dict())
    
    # If US location and contractor/intern
    if worker.location == "US" and worker.type in ["Global Contractor", "Global Intern"]:
        worker.requires_w4 = True
        
        # Add W-4 to required documents
        required_docs = get_required_docs(worker.type)
        required_docs.append("w4")
    
    save_worker(worker)
    
    # Audit log
    if worker.requires_w4:
        log_audit("us_contractor_created_w4_required", {
            'worker_id': worker.id,
            'location': worker.location,
            'type': worker.type,
            'w4_required': True
        })

# W-4 Expiration Check (daily job)
@scheduled_job('cron', hour=6, minute=0)
async def check_w4_expiry():
    contractors = db.collection('workers').where(
        'location', '==', 'US'
    ).where('requires_w4', '==', True).get()
    
    for contractor in contractors:
        w4_doc = db.collection('documents').where(
            'worker_id', '==', contractor.id
        ).where('document_type', '==', 'w4').get()
        
        if w4_doc and w4_doc.expires_at:
            days_until_expiry = (w4_doc.expires_at - today()).days
            
            # Alert at 30 days before expiry
            if days_until_expiry == 30 and not w4_doc.renewal_alert_sent:
                send_alert(f"W-4 expiring in 30 days for {contractor.name}")
                w4_doc.update({'renewal_alert_sent': True})
                
                log_audit("w4_expiry_alert_sent", {
                    'worker_id': contractor.id,
                    'expires_at': w4_doc.expires_at
                })
            
            # Block Gusto sync if W-4 expired
            if days_until_expiry < 0:
                log_audit("gusto_sync_blocked_expired_w4", {
                    'worker_id': contractor.id,
                    'action': 'Cannot sync until W-4 renewed'
                })
```

#### E. Gusto Sync Check
```python
@app.post("/api/integrations/gusto/sync")
async def sync_to_gusto(worker_id: str):
    worker = get_worker(worker_id)
    
    # Check location
    if worker.location != "US":
        return {"status": "skipped", "reason": "Non-US worker"}
    
    # Check W-4 exists and valid
    w4_doc = db.collection('documents').where(
        'worker_id', '==', worker_id
    ).where('document_type', '==', 'w4').get()
    
    if not w4_doc:
        return {
            "error": "Cannot sync to Gusto",
            "reason": "W-4 form required but not uploaded",
            "action": "Upload W-4 first"
        }
    
    if w4_doc.status != "verified":
        return {
            "error": "Cannot sync to Gusto",
            "reason": "W-4 not verified",
            "action": "HR must verify W-4"
        }
    
    if w4_doc.expires_at < today():
        return {
            "error": "Cannot sync to Gusto",
            "reason": "W-4 expired",
            "action": "Renew W-4 first"
        }
    
    # All checks passed, proceed with sync
    sync_result = call_gusto_api({
        'employee_id': worker_id,
        'name': worker.name,
        'email': worker.email,
        'w4_on_file': True
    })
```

#### F. Update Spec
**Add to 02-FEATURES.md:**
```
**US Contractor Tax Compliance (W-4):**

Requirement:
├─ Global Contractors (US): W-4 required before Gusto sync
├─ Global Interns (US): W-4 required if paid
├─ Non-US contractors: Not required

HR Workflow:
├─ Create US contractor → System auto-requires W-4
├─ Worker uploads W-4 to documents
├─ HR verifies W-4
├─ HR can now sync to Gusto
├─ System auto-alerts: 30 days before W-4 expires

W-4 Validity:
├─ Valid for: 12 months from verification
├─ Before expiry: System sends renewal alert (30 days)
├─ After expiry: Gusto sync blocked until renewed
├─ Audit trail: W-4 renewal attempts logged

If W-4 Missing/Expired:
├─ Gusto sync returns error
├─ HR sees: "W-4 required" in contractor profile
├─ Action: Upload or renew W-4, then retry sync
```

---

### **FIX #7: Review Lock After Submission**

**Problem:** Team Lead can edit review after submitting (change 4/5 to 2/5)

**Where to add:** 02-FEATURES.md (Reviews), 04-WORKFLOWS.md, 03-DATABASE.md

**Changes needed:**

#### A. Database Schema Change
```
reviews collection:
├─ review_id: "review-001"
├─ worker_id: "worker-001"
├─ review_type: "30-day" | "60-day" | "90-day" | "annual"
├─ rating: 4
├─ feedback: "Great progress"
├─ filled_by: "akshat@katbotz.com"
├─ filled_date: "2026-06-23"
├─ status: "draft" | "submitted" | "locked"  ← NEW
├─ submitted_date: "2026-06-23"  ← NEW
├─ locked_at: "2026-06-23T15:30:00Z"  ← NEW
├─ edit_history: [  ← NEW: Track changes
│  {
│    edited_at: "2026-06-23T10:30:00Z",
│    edited_by: "akshat@katbotz.com",
│    changed: { rating: { before: null, after: 4 } }
│  }
│ ]
└─ immutable_after_submit: true  ← NEW: Policy flag
```

#### B. Backend Logic
```python
# Create review (draft)
@app.post("/api/workers/{id}/reviews")
async def create_review(worker_id: str, review: ReviewCreate):
    review_record = {
        'worker_id': worker_id,
        'review_type': review.review_type,
        'rating': None,  # Not filled yet
        'feedback': None,
        'filled_by': None,
        'status': 'draft',  # Draft until submitted
        'created_by': request.user_email,
        'created_date': now()
    }
    
    saved = db.collection('reviews').add(review_record)
    return {"review_id": saved.id, "status": "draft"}

# Fill review (while in draft)
@app.put("/api/workers/{id}/reviews/{review_id}")
async def fill_review(review_id: str, updates: ReviewUpdate):
    review = db.collection('reviews').document(review_id).get()
    
    # Check status
    if review.status == "locked":
        return {
            "error": "Review is locked and cannot be edited",
            "submitted_date": review.submitted_date,
            "action": "Create new review if changes needed"
        }
    
    if review.status == "submitted":
        return {
            "error": "Review already submitted. Create new review to change",
            "submitted_date": review.submitted_date
        }
    
    # Can edit while draft
    if review.status == "draft":
        review.update({
            'rating': updates.rating,
            'feedback': updates.feedback,
            'edit_history': review.edit_history.append({
                'edited_at': now(),
                'edited_by': request.user_email,
                'changed': {
                    'rating': { 'before': review.rating, 'after': updates.rating },
                    'feedback': { 'before': review.feedback, 'after': updates.feedback }
                }
            })
        })
        
        log_audit("review_updated_draft", {
            'review_id': review_id,
            'status': 'draft',
            'changes': updates
        })
        
        return {"status": "updated", "review_status": "draft"}

# Submit review (final)
@app.post("/api/workers/{id}/reviews/{review_id}/submit")
async def submit_review(review_id: str):
    review = db.collection('reviews').document(review_id).get()
    
    # Check required fields
    if not review.rating or not review.feedback:
        return {
            "error": "Cannot submit incomplete review",
            "required": ["rating", "feedback"]
        }
    
    # Lock review
    review.update({
        'status': 'submitted',
        'submitted_date': now(),
        'submitted_by': request.user_email,
        'locked_at': now()
    })
    
    # Audit log
    log_audit("review_submitted_locked", {
        'review_id': review_id,
        'rating': review.rating,
        'status': 'locked'
    })
    
    # Notify worker
    send_notification(review.worker_id, {
        'type': 'review_completed',
        'message': f'Your {review.review_type} review is complete',
        'rating': review.rating
    })
    
    return {"status": "submitted_and_locked", "review_status": "locked"}

# Prevent edit of submitted/locked reviews
@app.patch("/api/workers/{id}/reviews/{review_id}")
async def patch_review(review_id: str, patch: dict):
    review = db.collection('reviews').document(review_id).get()
    
    if review.status in ["submitted", "locked"]:
        return {
            "error": "Cannot edit submitted review",
            "submitted_date": review.submitted_date,
            "reason": "Reviews are locked after submission to prevent tampering",
            "alternative": "Create new review if change needed"
        }
```

#### C. New Review (If Changes Needed)
```python
# If Team Lead needs to change submitted review
@app.post("/api/workers/{id}/reviews/{old_review_id}/update-with-new")
async def create_updated_review(worker_id: str, old_review_id: str, new_data: ReviewUpdate):
    old_review = get_review(old_review_id)
    
    if old_review.status != "locked":
        return {"error": "Can only create new review from locked review"}
    
    # Create new review
    new_review = {
        'worker_id': worker_id,
        'review_type': old_review.review_type,  # Same type
        'rating': new_data.rating,
        'feedback': new_data.feedback,
        'filled_by': request.user_email,
        'status': 'submitted',  # Auto-submit new version
        'replaces_review_id': old_review_id,  # Link to old version
        'reason_for_update': new_data.reason or "Updated review",
        'created_date': now()
    }
    
    saved = db.collection('reviews').add(new_review)
    
    # Audit log
    log_audit("review_replaced", {
        'old_review_id': old_review_id,
        'new_review_id': saved.id,
        'reason': new_data.reason
    })
    
    return {
        "status": "new_review_created",
        "new_review_id": saved.id,
        "old_review_status": "superseded"
    }
```

#### D. Update Spec
**Add to 02-FEATURES.md (Reviews section):**
```
**Review Submission & Lock:**

Draft Stage:
├─ Team Lead fills review (rating + feedback)
├─ Can edit anytime while in draft
├─ Status: "Draft" (not yet final)

Submit (LOCKS REVIEW):
├─ Team Lead clicks [Submit Review]
├─ System validates: Rating + feedback filled
├─ Status changes: Draft → Submitted (LOCKED)
├─ Submitted date recorded
├─ Worker gets notification

After Submission (LOCKED):
├─ Cannot edit submitted review
├─ Cannot delete submitted review
├─ Cannot change rating or feedback
├─ System returns 403 error if attempt to modify

If Change Needed:
├─ Create NEW review (don't edit old)
├─ Old review remains visible (superseded)
├─ Reason recorded: "Updated review"
├─ Audit trail shows both reviews + link

History:
├─ Worker sees: Original review + updates
├─ Can see timeline: Original date, updated date, reason
└─ Proof of review tampering prevention
```

---

## 🟡 HIGH PRIORITY FIXES (Should Implement)

---

### **FIX #8: Senior HR vs HR Role Clarity**

**Problem:** Both roles can verify documents. What's the difference?

**Update in 01-OVERVIEW.md:**
```
Senior HR Role:
├─ CREATE workers (manual or review Zoho failures)
├─ EDIT worker details (department, team lead)
├─ DELETE workers (mark for exit)
├─ APPROVE document verification (final approval)
├─ Access audit logs (own actions only)
├─ Manage integrations (Zoho, Gusto setup)
├─ Cannot: Override Founder, delete audit logs

HR Role:
├─ VERIFY documents (check and mark verified/rejected)
├─ VIEW all workers (list, details)
├─ ASSIGN projects (to workers)
├─ Cannot: Create/delete workers, mark for exit
├─ Cannot: Approve documents (Senior HR approves)
├─ Cannot: Access audit logs
├─ Cannot: Manage integrations

Decision Rule:
├─ Can hire/fire workers? → Senior HR
├─ Just day-to-day verification? → HR
```

---

### **FIX #9: Gusto Rate Limit Handling**

**Add to 05-TECH-STACK.md:**
```
Gusto Sync Queue:
├─ Batch size: Max 10 employees per sync
├─ Rate limit: 30 requests/minute (Gusto limit)
├─ Queue: Store pending syncs in Firestore
├─ Retry: 3 attempts with exponential backoff (1m, 5m, 15m)
├─ Status: HR can see [Synced] [Pending] [Failed]
└─ Alert: If sync fails 3x, notify HR
```

---

### **FIX #10: Litigation Hold Process**

**Add to 07-SECURITY.md:**
```
Legal Hold:
├─ Set by: Founder only
├─ Requires: Case number, reason, duration
├─ Effect: Auto-delete job skips this worker
├─ Expiry: Auto-remove on end date (or manual)
├─ Cannot extend indefinitely (must renew)
└─ Audit trail: Hold set, hold removed
```

---

### **FIX #11: Team Lead Access Control**

**Update 01-OVERVIEW.md (Team Lead section):**
```
Team Lead CAN see:
├─ Team member names, emails
├─ Assigned projects
├─ Goals (own team only)
├─ Reviews (own team only)
├─ Weekly summaries

Team Lead CANNOT see:
├─ Salary (locked)
├─ Contract amounts (locked)
├─ Invoice amounts (locked)
├─ Documents (HR-only)
├─ Other team leads' reviews
└─ Worker type (employee vs contractor vs intern)
```

---

### **FIX #12: Contract Amendment Versions**

**Already covered in FIX #4 above**

---

## 🟠 MEDIUM PRIORITY

---

### **FIX #13: API Session Timeout**

**Add to 07-SECURITY.md:**
```
Session timeout applies to:
├─ Web dashboard: 1 hour inactivity
├─ API calls: Update last_activity timestamp
├─ Both count: Web or API activity resets timer
└─ Result: True 1-hour inactivity across all
```

---

## 📊 IMPLEMENTATION PRIORITY

| Fix | Impact | Effort | Do First |
|-----|--------|--------|----------|
| #1: Duplicate emails | 🔴 High | Low | YES |
| #2: Invoices for exited | 🔴 High | Medium | YES |
| #3: Audit immutable | 🔴 High | Low | YES |
| #4: Rate locking | 🔴 High | Medium | YES |
| #5: Webhook retry | 🔴 High | Medium | YES |
| #6: W-4 forms | 🔴 High | Low | YES |
| #7: Review lock | 🔴 High | Low | YES |
| #8: Role clarity | 🟡 Medium | Low | Phase 2 |
| #9: Rate limits | 🟡 Medium | Medium | Phase 2 |
| #10: Litigation hold | 🟡 Medium | Low | Phase 2 |
| #11: Team Lead access | 🟡 Medium | Low | Phase 2 |
| #12: Amendment versions | 🟡 Medium | Medium | Phase 2 |
| #13: API timeout | 🟠 Low | Low | Phase 2 |

---

## ✅ FINAL CHECKLIST

Before submitting to boss:
- [ ] Fix #1: Duplicate email prevention (backend + spec)
- [ ] Fix #2: Invoice locking on contractor exit (workflow + backend)
- [ ] Fix #3: Audit trail immutability (backend rules + spec)
- [ ] Fix #4: Exchange rate locking with amendments (schema + workflow)
- [ ] Fix #5: Zoho webhook retry logic (backend job + dashboard)
- [ ] Fix #6: W-4 requirement for US contractors (schema + validation)
- [ ] Fix #7: Review lock after submission (backend + spec)
- [ ] All 7 fixes reflected in updated 02-FEATURES.md and 03-DATABASE.md
- [ ] Commit with message: "Implement 7 critical loophole fixes"
- [ ] All files in sync
