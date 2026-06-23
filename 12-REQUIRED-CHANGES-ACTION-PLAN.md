# REQUIRED CHANGES AND ACTION PLAN

This document specifies exactly what must be changed before production launch.

---

## CRITICAL CHANGES (6 Issues - Must Complete)

---

## CHANGE 1: AUTHENTICATION FALLBACK

**Current State:**
- Only Google OAuth authentication
- No fallback if Google is down
- System completely unavailable if Google OAuth service fails

**What Must Change:**
Add emergency authentication bypass procedure

**Where to Change:**
- 07-SECURITY.md (add new section)
- 08-HANDOVER.md (add to runbook)
- Implementation: FastAPI backend code

**Specific Changes:**

**File: 07-SECURITY.md**

Add new section after "Authentication" section:

```
## Emergency Access Procedure

If Google OAuth service is unavailable (confirmed via Google Cloud status page):

1. Senior HR can request emergency access token from system owner (Aayushi)
2. System owner generates temporary emergency token (valid for 1 hour):
   - Token can only access Senior HR role functions
   - Token cannot create new users or delete data
   - Token logs all actions with IP address and timestamp
3. Token is shared via secure channel (encrypted email, not Slack)
4. After 1 hour: Token automatically expires, must request new one
5. All emergency access is logged in audit trail with reason

Prerequisites:
- System owner must verify requestor identity via phone call
- Reason for emergency access must be documented
- Escalation: If Google OAuth is down >4 hours, escalate to Google Cloud support

Note: Emergency access is for operational continuity only, not a permanent solution.
Restore normal authentication as soon as Google services are available.
```

**File: 08-HANDOVER.md**

Add to "Runbook Examples" section:

```
Emergency Access Procedure:
1. Confirm Google OAuth is down (check status.google.com)
2. Call system owner: [Aayushi phone number]
3. System owner will:
   - Verify your identity via security questions
   - Generate emergency token valid for 1 hour
   - Email token to your official katbotz email
4. Use token to log in: Authorization: Bearer [token]
5. All actions logged automatically
6. After 1 hour: Token expires, request new one if needed
7. Document: Why emergency access was needed
```

**Implementation (Code):**

In FastAPI backend (`main.py`):

```python
@app.post("/auth/emergency-token")
async def request_emergency_token(request: EmergencyTokenRequest):
    """
    Generate emergency access token if OAuth is unavailable.
    Requires phone verification with system owner.
    Token valid for 1 hour, logs all usage.
    """
    # 1. Verify requestor identity (checked via phone by owner)
    # 2. Generate token with 1-hour expiry
    # 3. Log to audit trail: "Emergency token issued"
    # 4. Return token
    # 5. All subsequent requests with this token are logged
    pass
```

**Timeline to Implement:**
- Before launch
- Estimated: 4 hours (token generation, logging, runbook)

---

## CHANGE 2: SESSION TIMEOUT

**Current State:**
- No session timeout specified
- User logs in → session persists indefinitely
- Unattended computer = anyone can access
- Account compromise = permanent access

**What Must Change:**
Implement 30-minute inactivity timeout + browser session binding

**Where to Change:**
- 07-SECURITY.md (add session policy)
- Backend implementation (FastAPI)
- Frontend implementation (Next.js)

**Specific Changes:**

**File: 07-SECURITY.md**

Add new section after "Emergency Access Procedure":

```
## Session Management

Session Timeout Policy:
- Maximum session lifetime: 8 hours
- Inactivity timeout: 30 minutes
- If browser is closed: Session automatically ends
- If user goes idle for 30 minutes: Automatic logout + warning

Implementation:
1. Frontend tracks all user interactions (clicks, keyboard, scroll)
2. After 25 minutes of inactivity: Show warning "You will be logged out in 5 minutes"
3. After 30 minutes of inactivity: Automatic logout to login page
4. User must log in again to continue
5. Session resumed: User is back where they left off (page state preserved)

Security:
- Session token includes: user ID, role, creation time, last activity time
- Token cannot be transferred between browsers
- Token cannot be used from different IP address
- Token automatically expires (cannot be refreshed)
- Logout event recorded in audit trail
```

**Implementation (Code):**

Backend (`FastAPI`):
```python
# In JWT token payload:
{
    "user_id": "...",
    "role": "Senior HR",
    "created_at": timestamp,
    "last_activity": timestamp,
    "session_id": uuid,
    "ip_address": "...",
    "expires_at": timestamp + 8 hours
}

# On every request:
- Check token not expired
- Check last_activity < 30 minutes
- If >30 minutes idle: Return 401 Unauthorized (forces logout)
- Update last_activity timestamp
- Log activity to audit trail
```

Frontend (`Next.js`):
```javascript
// Track user activity
document.addEventListener('click', updateActivity);
document.addEventListener('keypress', updateActivity);

// Timer for inactivity warning
const inactivityTimer = setInterval(() => {
  if (timeSinceLastActivity > 25 minutes) {
    showWarning("You will be logged out in 5 minutes");
  }
  if (timeSinceLastActivity > 30 minutes) {
    logout(); // Redirect to login page
  }
}, 1000);

// On browser close/tab close:
window.addEventListener('unload', clearSession);
```

**Timeline to Implement:**
- Before launch
- Estimated: 6 hours (backend token logic, frontend timers, testing)

---

## CHANGE 3: LEGAL HOLD PROCESS

**Current State:**
- Document says "3-year retention" but this is assumed
- No legal confirmation obtained
- Auto-delete is hard-coded to 3 years
- No legal hold mechanism

**What Must Change:**
1. Get legal confirmation on retention period
2. Add legal hold workflow to system
3. Prevent auto-delete if legal hold is active

**Where to Change:**
- 00-PROPOSAL.md (update retention section)
- 07-SECURITY.md (add legal hold procedure)
- Firestore schema (add legal_hold field)
- Backend implementation (check legal hold before deletion)

**Specific Changes:**

**Action 1: Get Legal Sign-Off**

Before launch, obtain written confirmation from KATBOTZ legal team:

```
[Email to KATBOTZ Legal Team]

Subject: Confirmation needed: Data retention period for worker records

We are building a workforce management system that will store worker 
documents (PAN, Aadhaar, agreements, etc.).

Please confirm:
1. Under DPDP Act 2023, what is the minimum retention period for:
   - Worker personal data
   - Document records
   - Employment agreements
2. Can we automatically delete data after 3 years of exit?
3. If litigation is filed, can data be deleted, or must it be held indefinitely?
4. What is the procedure for legal hold on data during litigation?

We propose: 3-year retention after exit, then automatic deletion.
Please confirm this approach or suggest alternative.

Regards,
KATBOTZ HR
```

**Action 2: Update Proposal**

File: 00-PROPOSAL.md

Update "Retention and deletion policy" section:

```
## Data Retention and Deletion Policy (CONFIRMED)

Legal Sign-Off Status: CONFIRMED
- Confirmed by: [Legal Team Lead Name]
- Date: [Date]
- Confirmation: Email chain attached

Retention Period:
- Active employees: Data kept indefinitely
- Exited employees: Data retained for 3 years after exit
- Reason: Satisfies DPDP Act 2023 and Indian Labor Law requirements

Deletion Process:
- 3 years after exit: Worker record eligible for automatic deletion
- If legal hold is active: Deletion is blocked, held indefinitely
- Audit trail: Kept forever (for legal proof)

Legal Hold Procedure:
- When litigation filed: Legal team emails HR team
- HR logs into WOP and marks "Legal Hold" on worker record
- System checks: If legal_hold = true, skip automatic deletion
- When litigation resolved: Legal team notifies HR
- HR removes legal hold, deletion resumes
```

**Action 3: Update System Specification**

File: 07-SECURITY.md

Add new section:

```
## Legal Hold and Litigation Procedure

Legal Hold Trigger:
- Legal team receives litigation notice
- Legal team emails HR team with worker ID(s)
- HR logs into WOP (Senior HR only)

Applying Legal Hold:
1. Open worker record
2. Click "Apply Legal Hold"
3. Enter reason: [Litigation type: lawsuit, complaint, investigation]
4. Select hold duration or "indefinite"
5. System records: who, when, why

System Behavior with Legal Hold:
- Worker data cannot be deleted (even if 3+ years past exit)
- Worker record shows "Under legal hold" badge
- Monthly audit: System reports all active legal holds
- Deletion blocked until hold is removed

Releasing Legal Hold:
1. Legal team confirms litigation resolved
2. HR logs into WOP
3. Click "Release legal hold"
4. System records: when released, by whom
5. Auto-delete resumes on next monthly job

Audit Trail:
- Legal hold applied: [date, reason, who approved]
- Deletion blocked for X years due to hold
- Legal hold released: [date, who approved]
- Deletion resumed on: [date]
```

**Action 4: Database Schema Update**

Firestore collection: `workers`

Add fields:

```
workers/{workerId}
  legal_hold: boolean (default: false)
  legal_hold_reason: string (null if not held)
  legal_hold_applied_date: timestamp
  legal_hold_applied_by: string (user ID)
  legal_hold_expected_release: date or null (if indefinite)
```

**Action 5: Auto-Delete Job Update**

Before deleting, check:

```python
def monthly_delete_job():
    for worker in workers_eligible_for_deletion():
        # NEW: Check legal hold
        if worker.legal_hold == True:
            audit_log.append({
                "action": "delete_blocked",
                "reason": "legal_hold",
                "legal_hold_reason": worker.legal_hold_reason
            })
            continue  # Skip deletion
        
        # Otherwise: delete as normal
        delete_worker(worker)
```

**Timeline to Implement:**
- Legal sign-off: 1-2 weeks (business process, not code)
- Code/schema changes: 4 hours
- Total: Before launch

---

## CHANGE 4: AUTO-DELETE VERIFICATION

**Current State:**
- Auto-delete job runs monthly
- No verification that deletion actually occurred
- No alert if deletion fails
- Silent failure possible

**What Must Change:**
Add verification step to auto-delete job, with monitoring and alerts

**Where to Change:**
- 10-SYSTEM-ARCHITECTURE-DIAGRAMS.md (update auto-delete diagram)
- Backend implementation (add verification)
- Monitoring/alerting (Cloud Logging)

**Specific Changes:**

**File: 10-SYSTEM-ARCHITECTURE-DIAGRAMS.md**

Update "Offboarding and Auto-Delete Workflow" diagram to include verification:

```
[After Delete step]
            │
            ▼
┌──────────────────────────────────────┐
│  VERIFY Deletion Completed            │
│  Query Firestore: confirm deleted     │
│  Compare counts before/after          │
└────────┬───────────────────────────────┘
         │
    ┌────┴──────────────┐
    │                   │
    ▼                   ▼
┌────────────────┐  ┌──────────────────┐
│  Success       │  │  Failure         │
│  All deleted   │  │  Partial delete  │
└────────┬───────┘  │  OR error        │
         │          └────────┬─────────┘
         │                   │
         ▼                   ▼
┌────────────────┐  ┌──────────────────┐
│  Log Action    │  │  Alert HR:       │
│  "Verified     │  │  "Delete job     │
│   deletion:    │  │   failed. Manual  │
│   X items"     │  │   action needed"  │
└────────────────┘  │  Retry next month │
                    └──────────────────┘
```

**Implementation (Code):**

```python
def monthly_delete_job():
    """
    Monthly auto-deletion with verification and monitoring.
    """
    
    # Phase 1: Count what will be deleted
    workers_to_delete = get_eligible_workers()
    total_count = len(workers_to_delete)
    documents_to_delete = 0
    for worker in workers_to_delete:
        documents_to_delete += count_documents(worker.id)
    
    # Phase 2: Delete
    deleted_workers = 0
    deleted_documents = 0
    failed = []
    
    for worker in workers_to_delete:
        try:
            delete_worker_and_documents(worker.id)
            deleted_workers += 1
            deleted_documents += count_documents_before_delete
        except Exception as e:
            failed.append({
                "worker_id": worker.id,
                "error": str(e)
            })
            audit_log.error(f"Delete failed: {worker.id}: {e}")
    
    # Phase 3: VERIFY deletion
    verify_start = datetime.now()
    remaining_workers = db.query(workers).where(
        workers.id.in_(workers_to_delete_ids)
    ).count()
    
    if remaining_workers == 0:
        # Success
        audit_log.info({
            "action": "deletion_job_completed",
            "date": datetime.now(),
            "deleted_workers": deleted_workers,
            "deleted_documents": deleted_documents,
            "failed_count": len(failed),
            "verification_passed": True,
            "duration_seconds": (datetime.now() - verify_start).total_seconds()
        })
    else:
        # Failure - alert
        audit_log.error({
            "action": "deletion_job_failed_verification",
            "remaining_workers": remaining_workers,
            "expected_deleted": total_count,
            "actually_deleted": deleted_workers,
            "failed_items": failed
        })
        
        # Alert Senior HR
        send_alert_email(
            to="hr@katbotz.com",
            subject="URGENT: Auto-delete verification failed",
            body=f"""
            Auto-delete job failed verification.
            
            Expected to delete: {total_count} workers
            Actually deleted: {deleted_workers} workers
            Still remaining: {remaining_workers} workers
            Failed items: {failed}
            
            Manual action required: Review and retry deletion.
            """
        )
        
        # Alert monitoring
        monitoring.alert(
            severity="critical",
            message=f"Auto-delete verification failed: {remaining_workers} workers remain",
            details=failed
        )
    
    return {
        "deleted_workers": deleted_workers,
        "deleted_documents": deleted_documents,
        "failed_count": len(failed),
        "verification_passed": remaining_workers == 0
    }
```

**Timeline to Implement:**
- Before launch
- Estimated: 3 hours

---

## CHANGE 5: GUSTO SYNC ERROR HANDLING

**Current State:**
- WOP sends worker data to Gusto on activation
- No error handling specified
- If Gusto doesn't receive data: Silent failure
- Employee doesn't get paycheck

**What Must Change:**
Implement error handling with retry logic and alerts

**Where to Change:**
- 07-SECURITY.md (add section)
- Backend implementation

**Specific Changes:**

**File: 07-SECURITY.md**

Add new section:

```
## Gusto Integration Error Handling

Gusto Sync Workflow:
1. Worker activated in WOP
2. WOP calls Gusto API: POST /employees
3. Gusto returns: 200 OK + employee_id
4. WOP records: gusto_id, sync_timestamp
5. Worker can now be paid in Gusto

If Sync Fails:
1. Gusto returns error (4xx or 5xx)
2. WOP logs error to audit trail
3. WOP records: gusto_sync_status = "failed", retry_count = 0
4. WOP does NOT complete activation (worker cannot be activated)
5. Alert Senior HR: "Cannot activate [worker]: Gusto sync failed"

Retry Logic:
- Auto-retry: Every 1 hour, up to 24 hours
- Retry count increases with each attempt
- After 24 hours: Sync status = "failed", manual action required
- Senior HR gets: "Gusto sync failed after 24 retries for [worker]"

Manual Sync:
- Senior HR can manually trigger retry from WOP UI
- "Retry Gusto Sync" button appears when status = "failed"
- Click → WOP calls Gusto API again
- On success: gusto_sync_status = "complete"
- Worker can now be activated

Verification:
- After successful sync: Query Gusto to confirm employee exists
- If sync says "success" but employee doesn't exist: Alert
- Monthly report: "X workers synced, Y failed, Z manual retries"
```

**Implementation (Code):**

```python
class GuostoSyncManager:
    
    def sync_to_gusto(self, worker_id):
        """
        Sync worker data to Gusto with retry logic.
        Only called when worker activated.
        """
        
        worker = db.workers.get(worker_id)
        
        try:
            # Call Gusto API
            response = gusto_api.post('/employees', {
                'first_name': worker.first_name,
                'last_name': worker.last_name,
                'email': worker.email,
                'department': worker.department,
                'start_date': worker.joining_date,
                'salary': worker.salary
            })
            
            if response.status == 200:
                # Success - record it
                db.workers.update(worker_id, {
                    'gusto_id': response.employee_id,
                    'gusto_sync_status': 'complete',
                    'gusto_sync_timestamp': datetime.now()
                })
                
                audit_log.info({
                    'action': 'gusto_sync_success',
                    'worker_id': worker_id,
                    'gusto_id': response.employee_id
                })
                
                return True
            else:
                raise GuostoError(f"Status {response.status}")
        
        except Exception as e:
            # Failure - record for retry
            db.workers.update(worker_id, {
                'gusto_sync_status': 'failed',
                'gusto_sync_error': str(e),
                'gusto_sync_retry_count': 0,
                'gusto_sync_next_retry': datetime.now() + timedelta(hours=1)
            })
            
            audit_log.error({
                'action': 'gusto_sync_failed',
                'worker_id': worker_id,
                'error': str(e)
            })
            
            # Alert Senior HR
            send_alert_email(
                to='hr@katbotz.com',
                subject=f'Gusto sync failed for {worker.name}',
                body=f'{worker.name} could not be synced to Gusto: {e}'
            )
            
            return False
    
    def retry_failed_syncs(self):
        """
        Hourly job to retry failed Gusto syncs.
        """
        failed_workers = db.workers.find({
            'gusto_sync_status': 'failed',
            'gusto_sync_next_retry': {'$lte': datetime.now()}
        })
        
        for worker in failed_workers:
            if worker.gusto_sync_retry_count >= 24:
                # Give up after 24 retries (1 day)
                audit_log.error({
                    'action': 'gusto_sync_abandoned',
                    'worker_id': worker.id,
                    'retries': 24
                })
                send_alert_email(
                    to='hr@katbotz.com',
                    subject=f'URGENT: Manual action needed for {worker.name}',
                    body='Gusto sync has failed 24 times. Please manually sync in Gusto.'
                )
                continue
            
            # Retry
            self.sync_to_gusto(worker.id)
            db.workers.update(worker.id, {
                'gusto_sync_retry_count': worker.gusto_sync_retry_count + 1,
                'gusto_sync_next_retry': datetime.now() + timedelta(hours=1)
            })
```

**Timeline to Implement:**
- Before launch
- Estimated: 4 hours

---

## CHANGE 6: ZOHO DATA VALIDATION

**Current State:**
- Zoho sends offer data via webhook
- No validation of incoming data
- Attacker could send fake webhooks
- Invalid data could corrupt database

**What Must Change:**
1. Validate all fields from Zoho
2. Verify webhook signature
3. Rate limit webhook calls
4. Only process valid data

**Where to Change:**
- Backend implementation (webhook handler)
- 07-SECURITY.md (add webhook security section)

**Specific Changes:**

**File: 07-SECURITY.md**

Add new section:

```
## Zoho Recruit Webhook Security

Webhook Verification:
1. Zoho signs each webhook with HMAC-SHA256 signature
2. WOP verifies signature before processing
3. Invalid signature → Request rejected, logged, ignored
4. Only Zoho can send valid signatures (Zoho has secret key)

Data Validation (Before Creating Worker):
1. Email: Must match format, must be [name]@katbotz.com
2. Name: Cannot be null, cannot be empty, max 100 chars
3. Joining date: Must be valid date, must be today or future
4. Department: Must match known departments list
5. Worker type: Must be one of (Employee, Contractor, Intern)
6. If any validation fails: Reject webhook, alert Senior HR

Rate Limiting:
- Max 100 webhooks per hour from Zoho IP
- If exceeded: Block IP for 1 hour, alert security team

Webhook Failure Response:
- Valid signature, valid data → 200 OK, process webhook
- Valid signature, invalid data → 400 Bad Request, log error
- Invalid signature → 401 Unauthorized, do not process
```

**Implementation (Code):**

```python
import hmac
import hashlib

@app.post("/webhooks/zoho/offer-accepted")
async def zoho_webhook_offer_accepted(request: Request):
    """
    Zoho Recruit webhook: Offer accepted.
    Signature verified, data validated, rate limited.
    """
    
    # Get body and signature
    body = await request.body()
    signature = request.headers.get('X-Zoho-Webhook-Signature')
    
    # Step 1: Verify Zoho signature
    expected_signature = hmac.new(
        ZOHO_WEBHOOK_SECRET.encode(),
        body,
        hashlib.sha256
    ).hexdigest()
    
    if not hmac.compare_digest(signature, expected_signature):
        audit_log.warn({
            'action': 'webhook_invalid_signature',
            'ip': request.client.host
        })
        return {"error": "Invalid signature"}, 401
    
    # Step 2: Rate limit
    ip = request.client.host
    webhook_count = redis.incr(f"webhook_zoho:{ip}:count")
    if webhook_count > 100:
        audit_log.warn({
            'action': 'webhook_rate_limit_exceeded',
            'ip': ip,
            'count': webhook_count
        })
        return {"error": "Rate limit exceeded"}, 429
    
    # Step 3: Parse data
    data = await request.json()
    
    # Step 4: Validate fields
    errors = []
    
    if not data.get('email'):
        errors.append("email is required")
    elif not data['email'].endswith('@katbotz.com'):
        errors.append("email must be @katbotz.com domain")
    
    if not data.get('first_name') or len(data['first_name']) == 0:
        errors.append("first_name is required")
    elif len(data['first_name']) > 100:
        errors.append("first_name too long (max 100)")
    
    if not data.get('last_name') or len(data['last_name']) == 0:
        errors.append("last_name is required")
    elif len(data['last_name']) > 100:
        errors.append("last_name too long (max 100)")
    
    if not data.get('joining_date'):
        errors.append("joining_date is required")
    else:
        try:
            join_date = datetime.fromisoformat(data['joining_date'])
            if join_date < datetime.today():
                errors.append("joining_date cannot be in past")
        except:
            errors.append("joining_date must be valid ISO date")
    
    if not data.get('department'):
        errors.append("department is required")
    elif data['department'] not in VALID_DEPARTMENTS:
        errors.append(f"department must be one of {VALID_DEPARTMENTS}")
    
    if not data.get('worker_type'):
        errors.append("worker_type is required")
    elif data['worker_type'] not in ['Employee', 'Contractor', 'Intern']:
        errors.append("worker_type must be Employee, Contractor, or Intern")
    
    # Step 5: If validation failed, reject
    if errors:
        audit_log.warn({
            'action': 'webhook_validation_failed',
            'email': data.get('email'),
            'errors': errors
        })
        send_alert_email(
            to='hr@katbotz.com',
            subject='Zoho webhook validation failed',
            body=f"Email: {data.get('email')}\nErrors: {errors}"
        )
        return {"error": "Validation failed", "details": errors}, 400
    
    # Step 6: Create worker
    worker = db.workers.create({
        'name': f"{data['first_name']} {data['last_name']}",
        'email': data['email'],
        'type': data['worker_type'],
        'department': data['department'],
        'joining_date': data['joining_date'],
        'status': 'Created'
    })
    
    audit_log.info({
        'action': 'worker_created_from_zoho',
        'worker_id': worker.id,
        'email': worker.email
    })
    
    return {"worker_id": worker.id}, 200
```

**Timeline to Implement:**
- Before launch
- Estimated: 5 hours

---

## HIGH PRIORITY CHANGES (7 Issues - Should Complete)

---

## CHANGE 7: DOCUMENT VERIFICATION SLA

**Current State:**
- No timeout on pending documents
- HR could forget to verify
- Worker stuck in onboarding

**What Must Change:**
Define SLA and add alerts/escalation

**Where to Change:**
- 05-FUNCTIONAL-MODULES.md (update M3)
- Backend implementation (monitoring)
- Operational runbook

**Specific Changes:**

**File: 05-FUNCTIONAL-MODULES.md**

Update Module 3 "Verification Engine":

```
## Module 3 · Verification Engine

Service Level Agreement (SLA):
- Documents must be verified within 5 business days
- Escalation after 3 days: Auto-email HR
- Escalation after 5 days: Red flag in dashboard + email Senior HR
- After 7 days: Marked "OVERDUE" in audit trail

Alerts:
- Day 3: "Document pending for 3 days: [worker name] - [document type]"
- Day 5: "URGENT: Document overdue - [worker name]"
- Day 7: "CRITICAL: [worker name] stuck in verification for 7 days"

Dashboard Display:
- Verification queue sorted by age (oldest first)
- Color coding: Green (<3 days), Yellow (3-5 days), Red (>5 days)
- Count: "3 pending, 2 overdue"

Alert Recipients:
- Day 3-5: HR person assigned to document type
- Day 5+: Senior HR (escalation)

Worker Impact:
- Until all documents verified: Cannot progress to activation
- After 5 days: Email sent to worker: "Your documents are pending review. Expected by [date]."
```

**Timeline to Implement:**
- Before launch
- Estimated: 3 hours

---

## CHANGE 8: GUSTO TERMINATION CONFIRMATION

**Current State:**
- HR marks worker as exited
- WOP sends termination to Gusto
- No confirmation Gusto received it
- Payroll could still process

**What Must Change:**
Require explicit confirmation before allowing exit

**Where to Change:**
- Offboarding workflow in frontend
- Backend API
- Operational runbook

**Specific Changes:**

**New Step in Offboarding Workflow:**

Before completing offboarding, HR must:

1. Mark worker "Exiting" in WOP
2. HR must CONFIRM in Gusto that termination was processed:
   - Open Gusto (link in WOP)
   - Find employee
   - Confirm termination date is set
   - Mark checkbox: "Confirmed in Gusto"
3. Only after checkbox ticked: Allow final exit

**Implementation (Code):**

```python
# In offboarding workflow
class OffboardingWorkflow:
    
    def mark_for_exit(self, worker_id, last_day):
        """Mark worker for offboarding."""
        
        # Step 1: Send to Gusto
        gusto_sync(worker_id, termination_date=last_day)
        
        # Step 2: Update WOP
        db.workers.update(worker_id, {
            'status': 'Offboarding',
            'last_day': last_day,
            'gusto_termination_confirmed': False,  # NEW FIELD
            'gusto_termination_timestamp': None
        })
        
        # Step 3: Alert HR
        send_email(
            to='hr@katbotz.com',
            subject=f'Manual verification required: Confirm {worker.name} in Gusto',
            body=f'''
            Worker: {worker.name}
            Last day: {last_day}
            
            Please verify in Gusto:
            1. Open Gusto
            2. Find {worker.name}
            3. Confirm termination date = {last_day}
            4. Return to WOP and tick "Confirmed in Gusto"
            
            Link: [Gusto Dashboard]
            Confirmation in WOP: [Mark Complete]
            '''
        )
    
    def confirm_gusto_termination(self, worker_id):
        """HR confirms termination was processed in Gusto."""
        
        db.workers.update(worker_id, {
            'gusto_termination_confirmed': True,
            'gusto_termination_timestamp': datetime.now()
        })
        
        audit_log.info({
            'action': 'gusto_termination_confirmed',
            'worker_id': worker_id
        })
    
    def can_complete_exit(self, worker_id):
        """Check if exit can be finalized."""
        
        worker = db.workers.get(worker_id)
        
        # Cannot exit until Gusto confirmed
        if not worker.gusto_termination_confirmed:
            return False, "Gusto termination confirmation required"
        
        # Check all checklists complete
        if not all_revocation_items_done(worker_id):
            return False, "All access revocation items must be completed"
        
        return True, "All requirements met"
```

**Timeline to Implement:**
- Before launch
- Estimated: 3 hours

---

## CHANGE 9: BACKUP RECOVERY TESTING

**Current State:**
- Document says "tested before go-live"
- No ongoing testing mentioned
- Could be broken when needed

**What Must Change:**
Add monthly recovery test procedure

**Where to Change:**
- 08-HANDOVER.md (operational procedures)
- Implementation (automated test script)

**Specific Changes:**

**File: 08-HANDOVER.md**

Add to "Runbook" section:

```
## Monthly Backup Recovery Test

**Why:** Prove backups are recoverable. A backup that cannot be restored is useless.

**When:** First Tuesday of each month, 10 AM IST

**Procedure:**
1. Create staging Firestore instance (firestore-staging)
2. Download latest backup from gs://katbotz-backups/
3. Restore to staging instance
4. Verify:
   - Row count matches production (±0)
   - Sample records are intact (spot check 5 random workers)
   - Latest worker creation is present (ensure no stale backup)
   - Access control still enforced (Senior HR can see, Developer cannot)
5. Query Firestore for: count(workers), count(documents), count(audit_logs)
6. Compare to production numbers
7. If ≠ match: ALERT immediately, escalate to Cloud support
8. If ✓ match: Log success, mark in calendar

**Test Results:**
- Date: [Date]
- Duration: [X minutes]
- Rows restored: [X]
- Errors: None / [describe]
- Conclusion: Recoverable / NOT RECOVERABLE

Document in: /ops/backup-recovery-tests/[YYYY-MM-DD].log
```

**Timeline to Implement:**
- Before launch
- Estimated: 2 hours (script) + 30 min/month (testing)

---

## CHANGE 10: AUDIT LOG RETENTION POLICY

**Current State:**
- Document says "kept forever"
- No policy on archival, encryption, or cleanup
- No access control mentioned

**What Must Change:**
Define explicit retention policy

**Where to Change:**
- 07-SECURITY.md (add section)
- Implementation (archival script)

**Specific Changes:**

**File: 07-SECURITY.md**

Add new section:

```
## Audit Log Retention and Access

Retention Schedule:
- Live in Firestore: 2 years
- After 2 years: Auto-export to Cloud Storage (archive bucket)
- Archive bucket: Keep forever (encrypted with CMEK)
- Purpose: Proof of deletion, legal hold tracking, compliance audit

Archive Encryption:
- Key: Customer-managed encryption key (CMEK) in Google KMS
- Key stored in: /ops/keys/audit-log-cmek.json
- Key rotation: Every 90 days (automated)
- Access: Only authenticated GCP admins with specific IAM role

Access Control (Firestore Live Logs):
- Senior HR: Can view
- Founder: Can view
- HR Executive: Can view (read-only)
- Developers: Cannot view (blocked by IAM policy)

Access Control (Archive):
- Senior HR: Request access from Founder
- Founder: Has full access (technical owner)
- Security audit: Can request access from Founder + CTO

Monthly Audit:
- Rows in Firestore: [X]
- Rows moved to archive: [X]
- Archive bucket size: [X GB]
- Access denials: [X]
- Conclusion: Healthy / Needs attention
```

**Timeline to Implement:**
- Before launch
- Estimated: 4 hours

---

## CHANGE 11: GOOGLE DRIVE PERMISSION AUDIT

**Current State:**
- Documents stored in Drive
- Shared with workers + HR
- No monitoring of who still has access

**What Must Change:**
Add monthly permission audit procedure

**Where to Change:**
- 08-HANDOVER.md (operations)
- Implementation (audit script)

**Specific Changes:**

**File: 08-HANDOVER.md**

Add new section:

```
## Monthly Google Drive Permission Audit

**Why:** Prevent accidental data access by ex-employees, ex-HR, contractors

**When:** Last Friday of each month, 3 PM IST

**Procedure:**
1. List all worker folders in Google Drive: /KATBOTZ Workforce/2026/
2. For each folder, check permissions:
   - Should be shared with: [worker email] + [current HR team]
   - Should NOT be shared with: Inactive emails, ex-employees
3. If folder is shared with inactive person:
   - Check: Is person still employed? (HR confirms)
   - If NO: Unshare folder, log action
   - If YES: Keep shared, log reason

**Audit Results:**
- Date: [Date]
- Total worker folders: [X]
- Folders shared with inactive person: [X]
- Unshared: [X]
- Errors: None / [describe]

Document in: /ops/drive-audit-logs/[YYYY-MM-DD].log
```

**Timeline to Implement:**
- Before launch
- Estimated: 2 hours (script) + 30 min/month (audit)

---

## CHANGE 12: ZOHO WEBHOOK SIGNATURE VERIFICATION

**Current State:**
- Webhook handler exists (from Change 6)
- No mention of signature verification in all documents

**What Must Change:**
Document webhook security setup

**Where to Change:**
- 07-SECURITY.md (add to webhook section)
- Implementation (see Change 6 code)

**Specific Changes:**

**File: 07-SECURITY.md**

Update webhook section to add:

```
Webhook Secret Management:
- Secret stored in: /ops/secrets/zoho-webhook-secret.txt
- Rotation: Every 6 months
- Process: Update in Zoho dashboard → Update in WOP → All future webhooks verified against new secret
- Fallback: If secret rotated mid-day, accept both old and new secrets for 24 hours (backward compatibility)

Webhook Request/Response:
- Request: HTTPS POST to https://workforce.katbotz.com/webhooks/zoho/offer-accepted
- Header: X-Zoho-Webhook-Signature: [HMAC-SHA256 signature]
- Body: JSON with worker data
- Response: 200 OK (success), 4xx (validation error), 401 (signature invalid)

Monitoring:
- Daily report: X webhooks received, Y validation failures, Z signature failures
- Alert if: Signature failure rate > 5% (possible key mismatch)
```

**Timeline to Implement:**
- Before launch
- Estimated: 1 hour (documentation only, code already in Change 6)

---

## MEDIUM PRIORITY CHANGES (3 Issues - Should Address)

---

## CHANGE 13: PERMISSION AUDIT TRAIL

**File: 07-SECURITY.md**

Add new section:

```
## Permission Change Audit Trail

Every role change is logged:

Log Entry:
{
  'action': 'user_role_changed',
  'user_email': 'priya@katbotz.com',
  'old_role': 'HR',
  'new_role': 'Senior HR',
  'changed_by': 'founder@katbotz.com',
  'timestamp': '2026-06-23T10:30:00Z',
  'permissions_granted': [
    'view_all_workers',
    'verify_documents',
    'activate_workers',
    'mark_exit',
    'view_audit_log'
  ],
  'permissions_revoked': []
}
```

**Timeline to Implement:**
- First week after launch
- Estimated: 2 hours

---

## CHANGE 14: CONTENT VALIDATION FOR WEEKLY SUMMARY

**File: 05-FUNCTIONAL-MODULES.md**

Update weekly summary section:

```
Weekly Summary Constraints:
- Maximum length: 5,000 characters
- Minimum length: 10 characters
- No HTML/code allowed (plain text only)
- If limit exceeded: Show error "Summary too long, max 5,000 chars"
- If submitted: Logged in audit trail with character count
```

**Timeline to Implement:**
- First week after launch
- Estimated: 1 hour

---

## CHANGE 15: SECOND FACTOR FOR CRITICAL ACTIONS

**File: 07-SECURITY.md**

Add new section:

```
## Multi-Factor Authentication for Critical Actions

Critical Actions Requiring MFA:
1. Mark worker for exit (triggering 3-year retention)
2. Apply/release legal hold
3. Manual data deletion (emergency)
4. Grant/revoke Senior HR role

MFA Process:
- Action triggered: "Mark for Exit" clicked
- System sends OTP to Senior HR's email
- Senior HR enters OTP to confirm
- Only after OTP confirmed: Action executed
- Audit log records: action, timestamp, OTP sent to, OTP verified by

Backend:
- OTP generated: 6-digit code, valid for 10 minutes
- OTP stored: Redis with TTL 600 seconds
- OTP attempt limit: 5 wrong attempts → locked for 10 minutes
```

**Timeline to Implement:**
- Week 2 after launch
- Estimated: 4 hours

---

## SUMMARY TABLE

| # | Change | Severity | Timeline | Where to Change |
|---|--------|----------|----------|-----------------|
| 1 | Emergency auth bypass | Critical | Before launch | 07-SECURITY, 08-HANDOVER, backend |
| 2 | Session timeout (30 min) | Critical | Before launch | 07-SECURITY, backend, frontend |
| 3 | Legal hold procedure | Critical | Before launch (legal sign-off needed) | 00-PROPOSAL, 07-SECURITY, backend |
| 4 | Auto-delete verification | Critical | Before launch | 10-DIAGRAMS, backend |
| 5 | Gusto sync error handling | Critical | Before launch | 07-SECURITY, backend |
| 6 | Zoho data validation | Critical | Before launch | 07-SECURITY, backend |
| 7 | Document verification SLA | High | Before launch | 05-MODULES, backend |
| 8 | Gusto termination confirmation | High | Before launch | Frontend, backend, 08-HANDOVER |
| 9 | Backup recovery testing | High | Before launch | 08-HANDOVER, automation |
| 10 | Audit log retention policy | High | Before launch | 07-SECURITY, automation |
| 11 | Google Drive permission audit | High | Before launch | 08-HANDOVER, automation |
| 12 | Zoho webhook signature | High | Before launch | 07-SECURITY (doc only, code in #6) |
| 13 | Permission audit trail | Medium | Week 1 after | 07-SECURITY, backend |
| 14 | Summary content validation | Medium | Week 1 after | 05-MODULES, backend |
| 15 | MFA for critical actions | Medium | Week 2 after | 07-SECURITY, backend |

---

## IMPLEMENTATION APPROACH

**Before Launch (Recommended Order):**
1. Get legal sign-off (Change 3 - blocking, takes 1-2 weeks)
2. Implement backend security: Changes 1, 2, 5, 6, 7, 8, 9, 10, 11, 12 (parallel: ~40 hours total)
3. Add operational procedures: Changes 3, 9, 10, 11 in handover doc (~3 hours)
4. Test everything (Change 9: backup recovery test)
5. Final review before launch

**After Launch:**
- Week 1: Change 13, 14
- Week 2: Change 15

All code changes estimated at **~45 hours total**. With legal sign-off, can be ready in **2-3 weeks**.

