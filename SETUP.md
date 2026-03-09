# HaqDaari - Complete Setup Guide

> **Read this from top to bottom.** By the end you will have the app running locally OR deployed on AWS.

---

## What Is This App?

**HaqDaari** ("Your Right") auto-matches Indian citizens to government welfare schemes using only their 12-digit Aadhaar number.

**How it works:** Enter Aadhaar → system fetches demographics (name, age, income, caste, state, occupation) → matches against **147 real government schemes** (PM-KISAN, PMJAY, MGNREGA, Ladki Bahin, Kanya Sumangala, etc.) using a rule engine → shows eligible schemes with arbitrage opportunities (better schemes the person isn't enrolled in).

**Architecture:** React frontend → Node.js backend → Rule-based eligibility engine. Optionally deployed on AWS (Lambda + API Gateway + DynamoDB + S3). Currently, India Stack APIs (Aadhaar, DigiLocker, UPI) are mocked with 10 diverse test profiles.

---

## Prerequisites

Install these before starting:

### Required (Local Dev)

| Tool    | Install                                        | Verify           |
| ------- | ---------------------------------------------- | ---------------- |
| Node.js | [nodejs.org](https://nodejs.org/) (v18 or v20) | `node --version` |
| npm     | Comes with Node.js (v9+)                       | `npm --version`  |
| Git     | [git-scm.com](https://git-scm.com/)            | `git --version`  |

### Optional (Cloud Deployment Only)

| Tool       | Install                                                                                                  | Verify                |
| ---------- | -------------------------------------------------------------------------------------------------------- | --------------------- |
| AWS CLI v2 | [docs.aws.amazon.com/cli](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html) | `aws --version`       |
| Terraform  | [terraform.io/downloads](https://developer.hashicorp.com/terraform/downloads)                            | `terraform --version` |

> **You do NOT need an AWS account to run the demo locally.** Everything works offline with mock data.

---

## PART 1: Local Development (No AWS Needed)

### Step 1 - Clone the Repo

```bash
git clone <repo-url>
cd HaqDaari-gh/project_files
```

### Step 2 - Install Dependencies

```bash
npm install
```

This installs all three packages (backend, frontend, shared) via npm workspaces. Takes 1-2 minutes.

> **If `npm install` fails:** Delete `node_modules/` and `package-lock.json`, then retry.

### Step 3 - Start the Backend Server

Open a terminal:

```bash
cd project_files
npm run backend:dev
```

You should see:

```
[HaqDaari Backend] Local dev server running on http://localhost:3001
[HaqDaari Backend] Endpoints:
  POST /api/eligibility      - Zero-Touch Eligibility Engine
  POST /api/applications      - Submit application
  GET  /api/applications      - List applications
  ...
```

**Keep this terminal running.** The backend stays on port 3001.

> **Port 3001 already in use?**
>
> - **Windows PowerShell:** `Get-NetTCPConnection -LocalPort 3001 | ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }`
> - **Mac/Linux:** `lsof -ti:3001 | xargs kill -9`
>
> Then retry the `npm run backend:dev` command.

### Step 4 - Start the Frontend

Open a **second terminal**:

```bash
cd project_files/frontend
npm run dev
```

Opens at `http://localhost:5173`. The Vite dev server auto-proxies API calls (`/api/*`) to the backend on port 3001.

### Step 5 - Try the Demo

1. Open `http://localhost:5173` in your browser
2. Open `http://localhost:5173/onboarding` to go through the **Onboarding** slides (optional) → click "शुरू करें"
3. Navigate to **CSC Dashboard** (Home page → quick actions → "CSC Co-Pilot")
4. Enter an Aadhaar number from the table below
5. Click "Check Eligibility" → see matched schemes in real-time

### Test Profiles (10 Diverse Citizens)

| Aadhaar            | Name              | Income | State          | Caste   | Occupation    | Expected Schemes |
| ------------------ | ----------------- | ------ | -------------- | ------- | ------------- | ---------------- |
| `111122223333`     | Sunita Devi       | ₹48K   | Bihar          | SC      | daily_wage    | ~54              |
| `222233334444`     | Lakshmi Narayanan | ₹60K   | Tamil Nadu     | SC      | fisherman     | ~30              |
| `333344445555`     | Priya Sharma      | ₹1.5L  | Rajasthan      | General | self_employed | ~49              |
| `444455556666`     | Arjun Vishwakarma | ₹96K   | Madhya Pradesh | OBC     | artisan       | ~38              |
| `555566667777`     | Biju Mohan        | ₹84K   | Kerala         | OBC     | farmer        | ~47              |
| `666677778888`     | Meena Kumari      | ₹36K   | Odisha         | ST      | weaver        | ~52              |
| `777788889999`     | Rajendra Patil    | ₹5L    | Maharashtra    | General | farmer        | ~33              |
| `888899990000`     | Kavita Singh      | ₹1.2L  | Gujarat        | OBC     | street_vendor | ~49              |
| `999900001111`     | Mahendra Oraon    | ₹10L   | Jharkhand      | ST      | farmer        | ~31              |
| Any other 12-digit | Ramesh Kumar      | ₹72K   | Uttar Pradesh  | OBC     | farmer        | ~49              |

> Different profiles get different numbers of eligible schemes because the engine is **data-driven** - lower-income citizens naturally qualify for more BPL/poverty schemes.

### Step 6 - Test the API Directly (Optional)

```powershell
# PowerShell
Invoke-RestMethod -Uri "http://localhost:3001/api/eligibility" `
  -Method Post -Body '{"aadhaarNumber":"111122223333"}' `
  -ContentType "application/json" | ConvertTo-Json -Depth 5
```

```bash
# Mac/Linux
curl -s -X POST http://localhost:3001/api/eligibility \
  -H "Content-Type: application/json" \
  -d '{"aadhaarNumber":"111122223333"}' | jq .
```

### API Endpoints

| Method | Endpoint              | Body Example                                          | Description               |
| ------ | --------------------- | ----------------------------------------------------- | ------------------------- |
| POST   | `/api/eligibility`    | `{"aadhaarNumber":"111122223333"}`                    | Main eligibility check    |
| POST   | `/api/applications`   | `{"citizenId":"...","schemeId":"PM-KISAN"}`           | Submit application        |
| GET    | `/api/applications`   | -                                                     | List all applications     |
| POST   | `/api/transcribe`     | `{"audioContext":"default"}`                          | Mock Hindi speech-to-text |
| POST   | `/api/form-fill`      | `{"citizenName":"Sunita Devi","schemeId":"PM-KISAN"}` | Mock AI form fill         |
| POST   | `/api/knowledge-base` | `{"query":"PM-KISAN eligibility"}`                    | Mock knowledge base Q&A   |
| GET    | `/api/audit`          | -                                                     | List all audit events     |

---

## PART 2: AWS Cloud Deployment 

> **Only needed if you want to deploy to the cloud.**

### Step 1 - Create an AWS Account

If you don't have one: [aws.amazon.com/free](https://aws.amazon.com/free)

The free tier covers everything this demo needs ($0-6/month).

### Step 2 - Create an IAM User for CLI Access

Do NOT use your root account. Create a dedicated IAM user:

1. Go to **AWS Console → IAM → Users → Create User**
2. User name: `haqdaari-deploy`
3. Select **"Attach policies directly"**
4. Attach these policies:
   - `AmazonDynamoDBFullAccess`
   - `AmazonS3FullAccess`
   - `AWSLambda_FullAccess`
   - `AmazonAPIGatewayAdministrator`
   - `AWSCloudFormationFullAccess` (needed by Terraform)
   - `IAMFullAccess` (Terraform creates IAM roles)
   - `AmazonSNSFullAccess`
   - `CloudWatchFullAccess`
   - `AWSBudgetsActionsRolePolicy`
5. Click **Create User**
6. Go to the user → **Security credentials** → **Create access key**
7. Select **"Command Line Interface (CLI)"** → Check the confirmation → Create
8. **Save the Access Key ID and Secret Access Key** - you'll need them next

> **Security:** Never commit these keys to git. Never share them in chat/email. Delete the key when you're done.

### Step 3 - Configure AWS CLI

```bash
aws configure
```

Enter when prompted:

```
AWS Access Key ID:     <paste your access key from step 2>
AWS Secret Access Key: <paste your secret key from step 2>
Default region name:   ap-south-1
Default output format: json
```

Verify it works:

```bash
aws sts get-caller-identity
```

You should see your account ID and IAM user ARN. If this fails, double-check your keys.

> **Using AWS SSO instead?** Run `aws configure sso` and `aws sso login` - Terraform auto-detects SSO credentials.
>
> **Multiple AWS profiles?** Set the profile before running Terraform:
>
> ```powershell
> # PowerShell
> $env:AWS_PROFILE = "your-profile-name"
> ```
>
> ```bash
> # Mac/Linux
> export AWS_PROFILE=your-profile-name
> ```

### Step 4 - Deploy Infrastructure with Terraform

```bash
cd project_files/infra

# Download AWS provider
terraform init

# Preview what will be created (review this!)
terraform plan

# Deploy everything (type 'yes' when asked)
terraform apply
```

This creates all AWS resources in **ap-south-1 (Mumbai)**:

| Resource           | Name                                | Purpose               |
| ------------------ | ----------------------------------- | --------------------- |
| Lambda             | `haqdaari-demo-eligibility`         | Backend API           |
| API Gateway (HTTP) | `haqdaari-demo-api`                 | Public HTTPS endpoint |
| DynamoDB × 4       | `HaqDaariCitizenProfilesDemo`, etc. | Data storage          |
| S3 (scheme rules)  | `haqdaari-demo-scheme-rules`        | Scheme JSON storage   |
| S3 (frontend)      | `haqdaari-demo-frontend`            | PWA static hosting    |
| SNS                | `haqdaari-demo-citizen-alerts`      | SMS notifications     |
| CloudWatch         | Logs + error alarms                 | Monitoring            |
| Budget             | $50/month alarm                     | Cost control          |

> **No Terraform?** You can skip this and create resources manually in the AWS Console. See README.md for what each resource does.

### Step 5 - Build and Deploy Backend to Lambda

```bash
cd project_files/backend

# Option A: Simple bundle
npx tsc                     # Compile TypeScript → dist/
cd dist
zip -r ../function.zip .    # Create zip
cd ..
zip -r function.zip node_modules/

# Option B: Leaner bundle with esbuild (recommended)
npx esbuild src/handlers/eligibilityApi.ts \
  --bundle --platform=node --target=node20 --outfile=dist/index.js
cd dist && zip ../function.zip index.js && cd ..

# Deploy to Lambda
aws lambda update-function-code \
  --function-name haqdaari-demo-eligibility \
  --zip-file fileb://function.zip \
  --region ap-south-1
```

> **On Windows (PowerShell):** Use `Compress-Archive` instead of `zip`:
>
> ```powershell
> Compress-Archive -Path dist\* -DestinationPath function.zip -Force
> ```

### Step 6 - Upload Scheme Data + Frontend

```bash
# Upload scheme data to S3
cd project_files/infra
BUCKET=$(terraform output -raw scheme_rules_bucket)
aws s3 cp ../data/schemes/all-schemes.json s3://$BUCKET/all-schemes.json

# Build and upload frontend
cd ../frontend
echo "VITE_API_BASE=https://$(cd ../infra && terraform output -raw api_endpoint)" > .env.production
npm run build
FRONTEND_BUCKET=$(cd ../infra && terraform output -raw s3_frontend_bucket)
aws s3 sync dist/ s3://$FRONTEND_BUCKET/ --delete
```

### Step 7 - Set Up CloudFront 

The S3 frontend bucket blocks public access (security best practice). To serve the PWA publicly:

1. **AWS Console → CloudFront → Create Distribution**
2. Origin domain: select the `haqdaari-demo-frontend` S3 bucket
3. Origin access: **Origin Access Control (OAC)** → Create new OAC
4. Default root object: `index.html`
5. Add a custom error response: 403 → `/index.html`, 200 status (SPA routing)
6. Create the distribution
7. Copy the bucket policy CloudFront gives you → paste it into the S3 bucket policy

Your app is now live at `https://d1234abcd.cloudfront.net`

### Step 8 - Verify the Cloud Deployment

```bash
# Get your API endpoint
cd project_files/infra
terraform output api_endpoint

# Test the API
curl -X POST https://<your-api-endpoint>/api/eligibility \
  -H "Content-Type: application/json" \
  -d '{"aadhaarNumber":"111122223333"}'
```

### Step 9 - Tear It All Down

```bash
cd project_files/infra
terraform destroy   # type 'yes' - deletes ALL AWS resources
```

> This prevents any ongoing charges. Always destroy when you're done demoing.

---

## Troubleshooting

| Problem                          | Fix                                                                                                                                                                              |
| -------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `EADDRINUSE: 3001`               | Kill stale process: **Windows:** `Get-NetTCPConnection -LocalPort 3001 \| ForEach-Object { Stop-Process -Id $_.OwningProcess -Force }` **Mac:** `lsof -ti:3001 \| xargs kill -9` |
| Backend won't start              | Use `npm run backend:dev` from the `project_files/` root (runs `ts-node` under the hood)                                                                                         |
| Frontend shows blank page        | Make sure backend is running on port 3001 FIRST, then start frontend                                                                                                             |
| `npm install` fails              | Delete `node_modules/` and `package-lock.json`, then `npm install` again                                                                                                         |
| `terraform plan` - auth error    | Run `aws sts get-caller-identity` to verify credentials are configured                                                                                                           |
| `terraform apply` - S3 name      | S3 bucket names must be globally unique. Change `project_name` in `infra/main.tf` if there's a naming conflict                                                                   |
| DynamoDB "table not found"       | Leave `DYNAMO_AUDIT_TABLE` and `DYNAMO_APP_TABLE` unset - backend falls back to in-memory storage automatically                                                                  |
| Different scheme counts than doc | Slight variations (~±3) are normal due to floating-point scoring thresholds                                                                                                      |

---

## Files You Need

```
project_files/
├── backend/           # Node.js + TypeScript - Lambda handler + local server
├── frontend/          # React 18 + Vite + Tailwind PWA - 12 pages
├── shared/            # TypeScript types shared between backend/frontend
├── data/              # 147 verified government scheme definitions
├── infra/             # Terraform AWS config (optional - only for cloud deploy)
├── package.json       # npm workspaces config
├── README.md          # Full project documentation (architecture, API, tech stack)
└── SETUP_AND_DEPLOY.md  # This file - setup + deployment guide
```

**Files you can safely ignore/delete:**

- `node_modules/` - Auto-generated by `npm install`
- `package-lock.json` - Keep in git, auto-generated
