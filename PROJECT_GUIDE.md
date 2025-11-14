# Team 1 – User & Identity Service
## Complete Implementation Guide from Scratch

**Project Goal:** Build a secure authentication and authorization system for microservices using Asgardeo

---

## 📋 Table of Contents

1. [Project Requirements](#project-requirements)
2. [What You Need to Understand First](#what-you-need-to-understand-first)
3. [Phase 1: Asgardeo Evaluation](#phase-1-asgardeo-evaluation)
4. [Phase 2: Frontend Integration](#phase-2-frontend-integration)
5. [Phase 3: Backend Integration](#phase-3-backend-integration)
6. [Phase 4: RBAC Implementation](#phase-4-rbac-implementation)
7. [Phase 5: Microservices Authentication](#phase-5-microservices-authentication)
8. [Timeline & Milestones](#timeline--milestones)
9. [Team Structure & Responsibilities](#team-structure--responsibilities)
10. [Troubleshooting Guide](#troubleshooting-guide)

---

## 🎯 Project Requirements

### What You Must Deliver:

1. **Asgardeo Feasibility Report**
   - Can Asgardeo free plan meet our needs?
   - What are the limitations?
   - Is it production-ready?

2. **React Integration**
   - Users can login/logout
   - Display user information
   - Protect certain pages from unauthorized access

3. **Node.js Backend Integration**
   - Validate user tokens
   - Protect API endpoints
   - Get user information from tokens

4. **Role-Based Access Control (RBAC)**
   - Different users have different permissions
   - Admin can access everything
   - Regular users have limited access
   - Viewers can only see, not modify

5. **Microservices Authentication**
   - Multiple backend services
   - All services can verify the same user
   - Secure communication between services
   - No need to login separately for each service

---

## 📚 What You Need to Understand First

### Core Concepts

#### 1. Authentication vs Authorization
- **Authentication:** Who are you? (Login process)
- **Authorization:** What can you do? (Permissions/Roles)

#### 2. What is Asgardeo?
- Cloud-based identity service (like Auth0, Okta)
- Handles user registration, login, password reset
- Free tier available for testing
- Provides secure token-based authentication

#### 3. How Token-Based Authentication Works
```
User → Login → Asgardeo → Issues Token → User stores token
User → Makes request with token → Backend verifies token → Access granted/denied
```

#### 4. What is JWT (JSON Web Token)?
- Secure way to share information
- Contains user details and permissions
- Digitally signed (can't be tampered with)
- Has expiration time

#### 5. Microservices Architecture
- Instead of one big application
- Multiple small services (User Service, Order Service, etc.)
- Each service does one job well
- All services need to verify the same user

---

## 📊 Phase 1: Asgardeo Evaluation (Week 1)

### Goal
Determine if Asgardeo free plan is suitable for your project

### Tasks

#### Step 1: Create Asgardeo Account
- Visit Asgardeo website
- Sign up for free account
- Verify email
- Explore the dashboard

#### Step 2: Understand Free Tier Limits
**Research and document:**
- How many users can register? (typically 500)
- How many API calls per month?
- Can you use custom domains?
- What authentication methods are available?
- Is multi-factor authentication (MFA) included?
- Can you create custom roles?

#### Step 3: Create Test Application
- Register a new application in Asgardeo
- Choose "Single Page Application" type
- Note down the Client ID
- Configure redirect URLs
- Test the basic login flow

#### Step 4: Analyze Features
**Create a comparison table:**

| Feature | Available? | Limitations | Notes |
|---------|-----------|-------------|-------|
| User Registration | | | |
| Social Login (Google, Facebook) | | | |
| Email Verification | | | |
| Password Reset | | | |
| Multi-Factor Auth | | | |
| Custom Roles | | | |
| API Access | | | |
| Token Customization | | | |

#### Step 5: Test Token Structure
- Login as a test user
- Copy the token you receive
- Use JWT.io website to decode it
- Document what information is inside
- Check token expiration time

### Deliverables
- **Document:** "Asgardeo Feasibility Report"
  - Summary of capabilities
  - Limitations found
  - Recommendation (Yes/No with reasons)
  - Screenshots of dashboard
  - Sample decoded token

### Success Criteria
- Team understands what Asgardeo can/cannot do
- Clear decision made on using Asgardeo
- All limitations documented

---

## 💻 Phase 2: Frontend Integration (Week 1-2)

### Goal
Build a React application where users can login and logout

### Understanding the Flow
```
User clicks Login → Redirected to Asgardeo → 
User enters credentials → Asgardeo verifies → 
Redirects back to your app with token → 
App stores token → User is logged in
```

### Tasks

#### Step 1: Plan Your Frontend
**Pages needed:**
- Home/Landing page (public)
- Login page (redirects to Asgardeo)
- Dashboard (protected, only for logged-in users)
- Profile page (shows user information)
- Admin panel (only for admin role)

**Components needed:**
- Navigation bar (shows login/logout buttons)
- Protected route wrapper (prevents unauthorized access)
- User profile display
- Login button
- Logout button

#### Step 2: Setup React Project
- Create new React application
- Install Asgardeo React SDK
- Setup project folder structure
- Create configuration file for Asgardeo settings

#### Step 3: Configure Asgardeo Settings
**Information you need:**
- Client ID (from Asgardeo dashboard)
- Organization name
- Redirect URL (where to return after login)
- Signout URL (where to go after logout)

#### Step 4: Implement Login Flow
**What should happen:**
- User clicks "Login" button
- User is redirected to Asgardeo login page
- User enters username and password
- Asgardeo validates credentials
- User is redirected back to your app
- App receives and stores the token
- User sees their dashboard

#### Step 5: Implement Logout Flow
**What should happen:**
- User clicks "Logout" button
- Token is removed from storage
- User is redirected to home page
- Asgardeo session is cleared

#### Step 6: Display User Information
**What to show:**
- User's name
- Email address
- Profile picture (if available)
- Roles/permissions
- Login time

#### Step 7: Protect Routes
**Concept:**
- Public routes: Anyone can access (Home, About)
- Protected routes: Only logged-in users (Dashboard, Profile)
- Role-based routes: Only specific roles (Admin Panel)

### Deliverables
- Working React application
- Users can login/logout
- User information displayed
- Protected pages cannot be accessed without login
- Documentation with screenshots

### Success Criteria
- Login redirects to Asgardeo
- After login, user returns to app
- User information displayed correctly
- Logout clears session
- Non-logged-in users cannot access protected pages

---

## 🔧 Phase 3: Backend Integration (Week 2)

### Goal
Create Node.js backend that validates tokens and protects API endpoints

### Understanding Backend Security
```
Frontend → Makes API request with token →
Backend → Validates token with Asgardeo →
Backend → Checks if token is valid and not expired →
Backend → Sends response or rejects request
```

### Tasks

#### Step 1: Plan Your Backend API
**Endpoints needed:**
- `GET /` - Public endpoint (no token required)
- `GET /api/user` - Get current user info (token required)
- `GET /api/protected` - Test protected endpoint
- `GET /api/admin` - Admin only endpoint
- `POST /api/data` - Create data (token required)

#### Step 2: Setup Express Server
- Create Node.js project
- Install Express framework
- Install JWT validation library
- Setup environment variables
- Create basic server structure

#### Step 3: Configure Token Validation
**What you need:**
- Asgardeo Issuer URL
- Audience (your application identifier)
- Token signing algorithm (RS256)

**How validation works:**
- Extract token from request header
- Verify token signature
- Check if token is expired
- Verify issuer and audience
- Extract user information from token

#### Step 4: Create Authentication Middleware
**Purpose:**
- Runs before your actual endpoint logic
- Validates the token
- Attaches user information to request
- Rejects invalid tokens

**Flow:**
```
Request arrives → Middleware checks token →
If valid: Continue to endpoint →
If invalid: Return 401 Unauthorized error
```

#### Step 5: Implement Protected Endpoints
**For each endpoint, decide:**
- Is authentication required?
- What roles can access it?
- What data to return?
- What errors to handle?

#### Step 6: Test Token Validation
**Test scenarios:**
- Request without token → Should fail
- Request with valid token → Should succeed
- Request with expired token → Should fail
- Request with tampered token → Should fail
- Request with wrong audience → Should fail

#### Step 7: Enable CORS
**Why needed:**
- Frontend and backend run on different ports
- Browser blocks cross-origin requests by default
- Must configure allowed origins

### Deliverables
- Running Node.js backend
- Token validation working
- Protected endpoints secured
- Public endpoints accessible
- Error handling implemented
- Postman collection for testing

### Success Criteria
- Backend validates tokens correctly
- Invalid tokens are rejected
- User information extracted from token
- CORS configured properly
- All endpoints tested

---

## 🔐 Phase 4: RBAC Implementation (Week 3)

### Goal
Different users have different permissions based on their roles

### Understanding RBAC
```
Admin Role → Can do everything
User Role → Can read and write own data
Viewer Role → Can only read data
Guest Role → Very limited access
```

### Tasks

#### Step 1: Define Your Roles
**Create a role matrix:**

| Role | Access Level | Permissions |
|------|--------------|-------------|
| Admin | Full | Create, Read, Update, Delete all resources |
| Manager | High | Create, Read, Update own team's data |
| User | Medium | Create, Read, Update own data |
| Viewer | Low | Read own data only |
| Guest | Minimal | Read public data only |

#### Step 2: Configure Roles in Asgardeo
**In Asgardeo dashboard:**
- Create each role
- Define role descriptions
- Set up role hierarchy (if supported)
- Assign test users to different roles

#### Step 3: Include Roles in Token
**Configure Asgardeo to:**
- Add roles/groups to JWT token
- Identify the correct claim name
- Test by decoding token
- Verify roles appear correctly

#### Step 4: Create Role-Based Middleware
**Backend middleware logic:**
- After validating token
- Extract user roles from token
- Check if user has required role
- Allow or deny access based on role

**Scenarios to handle:**
```
Endpoint requires: Admin
User has: Admin → ✓ Allow
User has: User → ✗ Deny (403 Forbidden)

Endpoint requires: Admin OR Manager
User has: Manager → ✓ Allow
User has: Viewer → ✗ Deny
```

#### Step 5: Implement Frontend Role Checking
**Show/hide UI based on role:**
- Admin sees "Delete" button
- User does not see "Delete" button
- Admin sees admin menu
- Regular user does not see admin menu

**Important:** 
- Frontend hiding is for UX only
- Real security is on backend
- Frontend can be bypassed
- Always validate on backend

#### Step 6: Create Role-Based Routes
**Frontend routing:**
- `/admin` → Only admin can access
- `/dashboard` → Logged-in users
- `/` → Everyone can access

**Backend endpoints:**
- `DELETE /api/users/:id` → Admin only
- `GET /api/my-data` → Authenticated users
- `GET /api/public` → Everyone

#### Step 7: Test All Role Scenarios
**Create test matrix:**

| Test | User Role | Expected Result |
|------|-----------|----------------|
| Access admin panel | Admin | Success |
| Access admin panel | User | Denied |
| Delete user | Admin | Success |
| Delete user | Manager | Denied |
| View own data | User | Success |
| View other's data | User | Denied |

### Deliverables
- Role definitions document
- Roles configured in Asgardeo
- Backend role validation
- Frontend role-based UI
- Complete test results
- Permission matrix

### Success Criteria
- All roles defined and created
- Roles appear in JWT token
- Backend enforces role restrictions
- Frontend adapts to user role
- All test scenarios pass

---

## 🌐 Phase 5: Microservices Authentication (Week 3-4)

### Goal
Multiple backend services can all verify the same user token

### Understanding the Challenge
```
Problem:
User Service, Order Service, Payment Service all need to verify user
Each service shouldn't have its own login

Solution:
One login (Asgardeo) → Token works for all services
```

### Architecture Options

#### Option A: JWT Validation in Each Service
**Concept:**
- Each microservice validates JWT independently
- No central authentication service needed
- Each service trusts Asgardeo directly

**Pros:**
- No single point of failure
- Scales easily
- Fast (no extra network calls)
- Stateless

**Cons:**
- Each service needs validation logic
- Must update all services if config changes

**When to use:**
- You have many independent services
- High performance needed
- Services are in different locations

#### Option B: API Gateway Pattern
**Concept:**
- Single gateway at the front
- Gateway validates token
- Gateway forwards user info to services
- Services trust the gateway

**Pros:**
- Centralized authentication logic
- Services are simpler
- Easier to update auth logic
- Single point for logging/monitoring

**Cons:**
- Gateway is critical point
- Potential bottleneck
- Gateway must be highly available

**When to use:**
- You want centralized control
- Services are simple
- You need centralized logging

#### Option C: Token Introspection
**Concept:**
- Service receives token
- Service asks Asgardeo "Is this valid?"
- Asgardeo responds yes/no with user info
- Service proceeds based on response

**Pros:**
- Most secure
- Real-time validation
- Can revoke tokens immediately
- Always up-to-date

**Cons:**
- Extra network call per request
- Higher latency
- More load on Asgardeo
- Depends on Asgardeo availability

**When to use:**
- Security is critical
- Immediate token revocation needed
- Few requests per second

### Tasks

#### Step 1: Choose Your Approach
**Team decision process:**
- List your requirements
- Consider number of services
- Think about performance needs
- Discuss security requirements
- Choose best fit for your project
- Document the decision and reasoning

#### Step 2: Design Service Architecture
**Map out your services:**
```
Example:
- User Service: Manages user profiles
- Order Service: Handles orders
- Payment Service: Processes payments
- Notification Service: Sends emails/SMS
```

**Define service communication:**
- Which services talk to each other?
- Who initiates the communication?
- What data is shared?

#### Step 3: Implement Authentication in First Service
**Create User Service:**
- Setup Express server
- Add token validation
- Create user-related endpoints
- Test authentication
- Document the setup

#### Step 4: Implement Authentication in Second Service
**Create Order Service:**
- Follow same pattern as User Service
- Add token validation
- Create order-related endpoints
- Test authentication
- Verify it works independently

#### Step 5: Test Cross-Service Communication
**Scenario 1: User calls Order Service**
```
User → Login → Token
User → Order Service (with token) → Validates → Creates order
```

**Scenario 2: Order Service calls User Service**
```
Order Service receives user token →
Order Service calls User Service (with same token) →
User Service validates → Returns user data →
Order Service uses data to complete order
```

#### Step 6: Handle Token Sharing
**Best practices:**
- Never store tokens in databases
- Pass tokens in Authorization header
- Use HTTPS always
- Set appropriate token expiration
- Handle expired tokens gracefully

#### Step 7: Implement Token Refresh
**Why needed:**
- Tokens expire for security
- User shouldn't need to login again
- Refresh token gets new access token

**How it works:**
```
Access token expires →
App uses refresh token →
Gets new access token →
Continues working →
No user interaction needed
```

#### Step 8: Test Complete Flow
**End-to-end scenario:**
1. User logs in through frontend
2. Gets token from Asgardeo
3. Frontend calls User Service → Works
4. Frontend calls Order Service → Works
5. Order Service calls User Service → Works
6. Token expires
7. System refreshes token → User stays logged in
8. User logs out
9. Token invalidated → All services reject it

### Deliverables
- Microservices architecture diagram
- Minimum 2 working services
- Authentication decision document
- Shared authentication setup guide
- Service-to-service communication examples
- Complete testing documentation
- Performance benchmark results

### Success Criteria
- Multiple services running
- All services validate tokens
- Cross-service calls work
- Token refresh implemented
- Complete flow documented
- Performance acceptable

---

## 📅 Timeline & Milestones

### Week 1: Foundation & Learning
**Days 1-2: Asgardeo Research**
- Sign up for Asgardeo
- Explore dashboard
- Create test application
- Analyze free tier limits
- Document findings

**Days 3-4: Frontend Setup**
- Setup React project
- Integrate Asgardeo SDK
- Implement login flow
- Test authentication

**Day 5: Backend Setup**
- Setup Node.js project
- Configure token validation
- Create first protected endpoint

**Milestone 1:** ✓ User can login/logout, backend validates tokens

---

### Week 2: Core Features
**Days 1-2: Complete Frontend**
- Implement logout
- Display user information
- Protect routes
- Handle errors

**Days 3-4: Complete Backend**
- Add more endpoints
- Implement CORS
- Error handling
- Testing

**Day 5: Integration Testing**
- Frontend + Backend working together
- Fix integration issues
- Document setup process

**Milestone 2:** ✓ Complete authentication system working

---

### Week 3: Advanced Features
**Days 1-2: RBAC Planning**
- Define roles
- Create permission matrix
- Configure Asgardeo roles
- Assign test users

**Days 3-4: RBAC Implementation**
- Backend role validation
- Frontend role-based UI
- Test all scenarios

**Day 5: Microservices Planning**
- Choose architecture approach
- Design service structure
- Plan implementation

**Milestone 3:** ✓ RBAC fully implemented and tested

---

### Week 4: Microservices & Polish
**Days 1-2: First Microservice**
- Setup service structure
- Implement authentication
- Create endpoints
- Test independently

**Days 3-4: Second Microservice**
- Setup second service
- Implement authentication
- Test service-to-service calls
- Performance testing

**Day 5: Documentation & Demo**
- Complete all documentation
- Create demo presentation
- Record demo video
- Final testing

**Milestone 4:** ✓ Complete system delivered

---

## 👥 Team Structure & Responsibilities

### Recommended Team Size: 4-6 people

### Role 1: Team Lead (1 person)
**Responsibilities:**
- Overall project coordination
- Technical decisions
- Risk management
- Stakeholder communication
- Final code review

**Daily tasks:**
- Review team progress
- Unblock team members
- Make architecture decisions
- Update project documentation

---

### Role 2: Frontend Developer (1-2 people)
**Responsibilities:**
- React application development
- Asgardeo frontend integration
- User interface design
- Frontend RBAC implementation

**Deliverables:**
- Login/logout functionality
- Protected routes
- User dashboard
- Admin panel
- Role-based UI components

**Skills needed:**
- React.js
- JavaScript/TypeScript
- HTML/CSS
- OAuth/OIDC concepts

---

### Role 3: Backend Developer (1-2 people)
**Responsibilities:**
- Node.js API development
- Token validation
- Backend RBAC implementation
- Microservices setup

**Deliverables:**
- Express.js servers
- Protected API endpoints
- Role validation middleware
- Multiple microservices
- API documentation

**Skills needed:**
- Node.js/Express
- JWT/OAuth
- RESTful APIs
- Security concepts

---

### Role 4: Research & Documentation (1 person)
**Responsibilities:**
- Asgardeo research
- Feature evaluation
- Documentation
- Testing coordination

**Deliverables:**
- Feasibility report
- Setup guides
- API documentation
- Test plans
- User guides

**Skills needed:**
- Technical writing
- Research skills
- Testing
- Attention to detail

---

### Role 5: Quality Assurance (1 person - can be combined)
**Responsibilities:**
- Test planning
- Security testing
- Integration testing
- Bug tracking

**Deliverables:**
- Test cases
- Test results
- Bug reports
- Security audit

**Skills needed:**
- Testing methodologies
- Security awareness
- Attention to detail

---

### Daily Workflow

**Morning (15 minutes):**
- Stand-up meeting
- What did you do yesterday?
- What will you do today?
- Any blockers?

**During Day:**
- Work on assigned tasks
- Update task status
- Communicate blockers immediately
- Document as you go

**End of Day:**
- Commit code
- Update documentation
- Plan next day

**Weekly:**
- Demo to stakeholders
- Team retrospective
- Plan next week

---

## 🔍 Troubleshooting Guide

### Common Problems & Solutions

#### Problem 1: "CORS Error" in browser
**Symptoms:**
- Frontend can't call backend
- Error in browser console
- Requests blocked

**Cause:**
- Backend not allowing frontend origin
- Missing CORS configuration

**Solution:**
- Configure CORS in backend
- Allow frontend URL
- Allow credentials if needed

---

#### Problem 2: "Token validation failed"
**Symptoms:**
- Backend rejects valid tokens
- 401 Unauthorized errors

**Possible causes & solutions:**
- **Wrong issuer:** Check Asgardeo issuer URL matches
- **Wrong audience:** Verify audience configuration
- **Expired token:** Check token expiration time
- **Clock skew:** Sync server time
- **Wrong algorithm:** Use RS256

---

#### Problem 3: "Roles not in token"
**Symptoms:**
- Token doesn't contain role information
- RBAC not working

**Solution:**
- Configure Asgardeo application
- Enable groups/roles claim
- Check token attributes settings
- Verify in decoded token

---

#### Problem 4: "Infinite redirect loop"
**Symptoms:**
- Login keeps redirecting
- Never reaches dashboard

**Cause:**
- Redirect URL mismatch
- Protected route configured wrong

**Solution:**
- Check redirect URLs in Asgardeo
- Verify route protection logic
- Check token storage

---

#### Problem 5: "Token not persisting"
**Symptoms:**
- User logged out on page refresh
- Token disappears

**Cause:**
- Token not stored properly
- Wrong storage method

**Solution:**
- Use session storage or local storage
- Configure Asgardeo SDK storage
- Check browser privacy settings

---

## 📊 Success Metrics

### Technical Metrics
- [ ] Login success rate > 99%
- [ ] Token validation < 100ms
- [ ] API response time < 200ms
- [ ] Zero security vulnerabilities
- [ ] Test coverage > 80%

### Functional Metrics
- [ ] All roles working correctly
- [ ] 100% of protected routes secured
- [ ] All microservices authenticate
- [ ] Token refresh working
- [ ] Proper error handling

### Documentation Metrics
- [ ] Complete setup guide
- [ ] All APIs documented
- [ ] Architecture diagrams
- [ ] Test results recorded
- [ ] Troubleshooting guide

---

## 📚 Learning Resources

### Must Read/Watch
1. **OAuth 2.0 Basics**
   - Understand authorization flow
   - Learn about tokens
   - Security best practices

2. **JWT Explained**
   - What is JWT
   - Token structure
   - How to validate

3. **Microservices Security**
   - Service-to-service authentication
   - Token propagation
   - Security patterns

4. **RBAC Concepts**
   - Roles vs Permissions
   - Access control models
   - Best practices

### Recommended Tools
- **JWT.io** - Decode and inspect tokens
- **Postman** - Test APIs
- **Browser DevTools** - Debug frontend
- **Asgardeo Documentation** - Official guides

---

## ✅ Final Checklist

### Before Declaring Complete

**Authentication:**
- [ ] Users can register (if enabled)
- [ ] Users can login
- [ ] Users can logout
- [ ] Tokens are validated
- [ ] Invalid tokens rejected
- [ ] Token refresh working

**Authorization:**
- [ ] Roles defined
- [ ] Roles assigned to users
- [ ] Backend enforces roles
- [ ] Frontend respects roles
- [ ] All role scenarios tested

**Microservices:**
- [ ] At least 2 services running
- [ ] All services validate tokens
- [ ] Service-to-service calls work
- [ ] Consistent authentication
- [ ] Performance acceptable

**Documentation:**
- [ ] Setup guide complete
- [ ] Architecture documented
- [ ] API documentation
- [ ] Testing guide
- [ ] Troubleshooting guide
- [ ] Decision log

**Quality:**
- [ ] All features tested
- [ ] Security tested
- [ ] Performance tested
- [ ] Error handling tested
- [ ] No critical bugs

**Demo:**
- [ ] Demo script prepared
- [ ] All features working
- [ ] Backup plan ready
- [ ] Questions anticipated

---

## 🎯 Key Takeaways

### Remember These Points:

1. **Security First**
   - Always validate on backend
   - Never trust frontend alone
   - Use HTTPS in production
   - Keep tokens secure

2. **Start Simple**
   - Get basic auth working first
   - Add RBAC next
   - Then microservices
   - Don't try everything at once

3. **Document Everything**
   - Write as you code
   - Explain decisions
   - Future you will thank you
   - Team members need context

4. **Test Thoroughly**
   - Happy path
   - Error cases
   - Edge cases
   - Security scenarios

5. **Communicate Often**
   - Daily updates
   - Ask questions early
   - Share blockers
   - Celebrate wins

---

**Good luck with your implementation!**

*This guide provides the roadmap. Now it's your team's job to execute it. Start with Phase 1 and work systematically through each phase. Don't skip steps, and always document your learnings.*
