# Deploy to Firebase (Cloud Run) — Quick Steps

This repo is configured to deploy the Next.js app as a container to Cloud Run, and route Firebase Hosting to Cloud Run.

Prerequisites
- Google Cloud project: `ajk-powermeter` (already set in `.firebaserc`)
- Billing enabled on the GCP project (Cloud Run may require billing for certain features)
- Google Cloud IAM permissions to create Service Accounts and keys
- GitHub repository with this project

Recommended Auth (Service Account)
1. In Google Cloud Console, open IAM & Admin → Service accounts → Create Service Account.
   - Name: `github-deploy-sa`
   - Roles: `Cloud Run Admin`, `Storage Admin` (for images), `Firebase Admin` or `Firebase Hosting Admin` and `Service Account User`.
2. Create a JSON key for the service account and download it.
3. In GitHub repo, go to Settings → Secrets and variables → Actions → New repository secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: paste the entire JSON key file content.

Fallback Auth (firebase token)
- Run locally: `firebase login:ci` and paste the generated token as GitHub secret `FIREBASE_TOKEN` (less recommended).

Deploy (automatic via GitHub Actions)
- Push to `main` branch. Workflow `.github/workflows/firebase-deploy.yml` will build, push container to GCR, deploy Cloud Run service, and update Firebase Hosting.

Manual deploy (if you prefer)
1. Build and run locally:
```bash
npm ci
npm run build
npm run start
```
2. To deploy manually to Cloud Run, use `gcloud` commands (requires gcloud auth):
```bash
gcloud builds submit --tag gcr.io/ajk-powermeter/ajk-powermeter-service
gcloud run deploy ajk-powermeter-service --image gcr.io/ajk-powermeter/ajk-powermeter-service --region=asia-southeast1 --platform=managed
```
3. Deploy hosting rewrite:
```bash
firebase deploy --only hosting --project ajk-powermeter
```

If you want, saya dapat membuat PR dan push ke GitHub untuk Anda; berikan akses repo atau URL nya. Setelah Anda tambahkan secret `FIREBASE_SERVICE_ACCOUNT`, push ke `main` akan memicu deploy otomatis.
