# Requirements Document: HaqDaari

## Introduction

HaqDaari is an AI-powered autonomous agent that helps Indian citizens discover and apply for government welfare schemes. The system addresses a critical problem: while 750+ government schemes exist across central and state levels, 40-60% of eligible citizens never claim benefits due to awareness gaps, complex forms, language barriers, and digital illiteracy. This results in Rs 2.68 lakh crore of unclaimed welfare benefits annually.

The system provides zero-touch eligibility detection, scheme arbitrage analysis, transparent AI operations (Shadow Mode), and offline-capable CSC operator assistance to maximize welfare benefit uptake across India's diverse population.

## Glossary

- **HaqDaari_System**: The complete AI-powered welfare scheme discovery and application platform
- **Eligibility_Engine**: Component that matches citizen profiles against scheme eligibility rules
- **Scheme_Arbitrage_Detector**: Component that identifies better alternative schemes for enrolled citizens
- **Shadow_Mode**: Transparent AI preview system that shows citizens what actions will be taken before execution
- **CSC_Co_Pilot**: Offline-capable assistant for Common Service Center operators
- **Citizen**: End user seeking government welfare benefits
- **CSC_Operator**: Staff at Common Service Centers who assist citizens
- **Aadhaar_eKYC**: Government API for demographic verification using Aadhaar number
- **DigiLocker_API**: Government API for fetching citizen documents
- **Scheme_Rules**: Eligibility criteria and benefit details for government welfare schemes
- **India_Stack**: Collection of government APIs including Aadhaar, DigiLocker, and UPI
- **Bedrock_Knowledge_Base**: AWS service for RAG-based AI retrieval from scheme rules
- **Gupshup**: WhatsApp Business API provider
- **PWA**: Progressive Web Application
- **CSC**: Common Service Center (500,000+ centers across India)

## Requirements

### Requirement 1: Zero-Touch Eligibility Detection

**User Story:** As a citizen, I want to discover all welfare schemes I'm eligible for by simply providing my Aadhaar number, so that I don't miss benefits due to lack of awareness.

#### Acceptance Criteria

1. WHEN a Citizen provides an Aadhaar number with consent, THE Eligibility_Engine SHALL call the Aadhaar_eKYC API to retrieve demographic data
2. WHEN demographic data is retrieved, THE Eligibility_Engine SHALL extract name, age, gender, and address from the response
3. WHEN the Aadhaar_eKYC call succeeds, THE Eligibility_Engine SHALL call the DigiLocker_API to fetch income certificates, caste certificates, and land records
4. WHEN citizen profile data is complete, THE Eligibility_Engine SHALL query the Bedrock_Knowledge_Base with the citizen profile against 750+ Scheme_Rules
5. WHEN scheme matching completes, THE HaqDaari_System SHALL return all eligible schemes within 30 seconds
6. IF the Aadhaar_eKYC API fails, THEN THE HaqDaari_System SHALL return an error message and request the Citizen to retry
7. IF the DigiLocker_API returns no documents, THEN THE Eligibility_Engine SHALL proceed with demographic data only and flag missing documents
8. THE Eligibility_Engine SHALL store citizen consent records with timestamp and purpose in DynamoDB

### Requirement 2: Scheme Arbitrage Detection

**User Story:** As a citizen enrolled in welfare schemes, I want to know if better alternatives exist, so that I can maximize my benefits.

#### Acceptance Criteria

1. WHEN a Citizen's current scheme enrollments are known, THE Scheme_Arbitrage_Detector SHALL compare them against all eligible alternative schemes
2. WHEN a better scheme is identified, THE Scheme_Arbitrage_Detector SHALL calculate the benefit difference in monetary terms
3. WHEN benefit difference exceeds Rs 100 per month, THE HaqDaari_System SHALL notify the Citizen with a comparison message
4. THE comparison message SHALL include current scheme name, current benefit amount, alternative scheme name, and alternative benefit amount
5. WHEN multiple better alternatives exist, THE Scheme_Arbitrage_Detector SHALL rank them by total benefit value
6. THE HaqDaari_System SHALL provide a one-click option to initiate the scheme switch process

### Requirement 3: Shadow Mode Transparency

**User Story:** As a citizen with limited digital literacy, I want to see exactly what the AI will do before it acts, so that I can trust the system and maintain control.

#### Acceptance Criteria

1. WHEN the HaqDaari_System plans to execute any action, THE Shadow_Mode SHALL generate a preview in simple Hindi language
2. THE preview SHALL list each specific action including API calls, data fetches, form fields to be filled, and submission targets
3. WHEN the preview is displayed, THE HaqDaari_System SHALL wait for explicit Citizen approval before proceeding
4. THE Citizen SHALL have options to approve, modify, or cancel the planned actions
5. WHEN a Citizen cancels an action, THE HaqDaari_System SHALL not execute any part of the planned workflow
6. THE HaqDaari_System SHALL log every action with timestamp, action type, and citizen approval status for audit purposes
7. WHEN an action is completed, THE HaqDaari_System SHALL show the Citizen what was done and allow reversal within 24 hours where applicable

### Requirement 4: CSC Co-Pilot Offline Operation

**User Story:** As a CSC operator, I want to assist citizens without smartphones using voice conversation that auto-fills forms, so that I can serve more people efficiently even without internet.

#### Acceptance Criteria

1. WHEN a CSC_Operator initiates a session, THE CSC_Co_Pilot SHALL activate Amazon Transcribe for Hindi speech-to-text conversion
2. WHEN the CSC_Operator speaks with a Citizen, THE CSC_Co_Pilot SHALL transcribe the conversation in real-time
3. WHEN relevant information is detected in the conversation, THE CSC_Co_Pilot SHALL auto-fill corresponding government form fields
4. WHEN a form is partially filled, THE CSC_Co_Pilot SHALL suggest additional eligible schemes based on the conversation context
5. WHILE internet connectivity is unavailable, THE CSC_Co_Pilot SHALL store all data locally in IndexedDB via AWS IoT Greengrass
6. WHEN internet connectivity is restored, THE CSC_Co_Pilot SHALL sync all locally stored data to DynamoDB and S3
7. THE CSC_Co_Pilot SHALL display the auto-filled form on the PWA dashboard for CSC_Operator review before submission
8. THE CSC_Co_Pilot SHALL maintain conversation history for the current session only and purge after submission

### Requirement 5: Multi-Channel Access

**User Story:** As a citizen with limited smartphone access, I want to interact with HaqDaari through WhatsApp, voice calls, or at a CSC, so that I can access welfare schemes regardless of my device or connectivity.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL accept text messages via WhatsApp Business API through Gupshup
2. THE HaqDaari_System SHALL accept voice notes via WhatsApp and transcribe them using Amazon Transcribe
3. THE HaqDaari_System SHALL provide a toll-free voice call option that connects to the AI agent
4. WHEN a Citizen accesses via WhatsApp, THE HaqDaari_System SHALL respond with text messages optimized for 2G connectivity
5. THE HaqDaari_System SHALL provide a React PWA for Shadow_Mode previews, form reviews, and CSC dashboards
6. THE PWA SHALL work offline and sync when connectivity is available
7. WHEN a Citizen uses voice call, THE HaqDaari_System SHALL use Amazon Transcribe for speech-to-text and Amazon Polly for text-to-speech responses in Hindi

### Requirement 6: Scheme Knowledge Base Management

**User Story:** As a system administrator, I want to maintain up-to-date scheme rules for 750+ government programs, so that citizens receive accurate eligibility information.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL store all Scheme_Rules in Amazon S3 in structured JSON format
2. THE Bedrock_Knowledge_Base SHALL index all Scheme_Rules for RAG-based retrieval
3. WHEN a Scheme_Rule is updated, THE HaqDaari_System SHALL re-index the Bedrock_Knowledge_Base within 1 hour
4. THE Scheme_Rules SHALL include eligibility criteria, benefit amounts, application process, required documents, and scheme authority contact
5. THE HaqDaari_System SHALL support scheme rules in both English and Hindi
6. WHEN a scheme is deprecated, THE HaqDaari_System SHALL mark it as inactive and exclude it from eligibility matching

### Requirement 7: Citizen Profile Management

**User Story:** As a citizen, I want my profile and document data to be securely stored and reusable, so that I don't have to provide the same information repeatedly.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL store citizen profiles in Amazon DynamoDB with encryption at rest
2. THE citizen profile SHALL include Aadhaar number (hashed), demographics, fetched documents, scheme enrollments, and consent records
3. WHEN a Citizen returns to the system, THE HaqDaari_System SHALL retrieve their existing profile using phone number or Aadhaar
4. THE HaqDaari_System SHALL refresh DigiLocker documents only if they are older than 30 days
5. THE HaqDaari_System SHALL allow citizens to view, update, and delete their profile data
6. WHEN a Citizen requests data deletion, THE HaqDaari_System SHALL purge all personal data within 48 hours and retain only anonymized analytics

### Requirement 8: Application Form Auto-Fill and Submission

**User Story:** As a citizen, I want the system to automatically fill and submit government application forms on my behalf, so that I don't struggle with complex paperwork.

#### Acceptance Criteria

1. WHEN a Citizen selects a scheme to apply for, THE HaqDaari_System SHALL retrieve the corresponding application form template
2. THE HaqDaari_System SHALL map citizen profile data to form fields using AI-based field matching
3. WHEN all required fields are populated, THE HaqDaari_System SHALL generate a preview of the filled form
4. THE Shadow_Mode SHALL display the form preview and request Citizen approval before submission
5. WHEN approved, THE HaqDaari_System SHALL submit the form to the government portal API or generate a PDF for manual submission
6. IF the government portal API is unavailable, THEN THE HaqDaari_System SHALL generate a pre-filled PDF and send it via WhatsApp or email
7. THE HaqDaari_System SHALL send an SMS confirmation with application reference number after successful submission

### Requirement 9: Notification and Follow-Up

**User Story:** As a citizen, I want to receive timely notifications about my application status and new eligible schemes, so that I stay informed without actively checking.

#### Acceptance Criteria

1. WHEN an application is submitted, THE HaqDaari_System SHALL send an SMS notification via Amazon SNS with the application reference number
2. THE HaqDaari_System SHALL check application status by polling government portal APIs every 7 days
3. WHEN application status changes, THE HaqDaari_System SHALL notify the Citizen via WhatsApp and SMS
4. WHEN a new scheme becomes available that matches a Citizen's profile, THE HaqDaari_System SHALL send a notification within 24 hours
5. THE HaqDaari_System SHALL send a reminder if a scheme application deadline is within 7 days
6. THE Citizen SHALL be able to opt out of notifications at any time

### Requirement 10: Scalability and Performance

**User Story:** As a system architect, I want the system to handle 1 crore users at less than Rs 1 per citizen per month, so that the solution is financially sustainable at scale.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL use AWS Lambda for compute to enable automatic scaling
2. THE Eligibility_Engine SHALL return results within 30 seconds for 95% of requests
3. THE HaqDaari_System SHALL handle 1000 concurrent users without degradation
4. THE HaqDaari_System SHALL use DynamoDB on-demand pricing to scale with usage
5. THE HaqDaari_System SHALL cache frequently accessed Scheme_Rules in Amazon ElastiCache to reduce Bedrock API calls
6. THE HaqDaari_System SHALL implement request throttling to stay within AWS service quotas
7. THE HaqDaari_System SHALL monitor costs using AWS Cost Explorer and alert when monthly cost per user exceeds Rs 1

### Requirement 11: Security and Compliance

**User Story:** As a citizen, I want my Aadhaar and personal data to be protected according to Indian data protection laws, so that my privacy is maintained.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL encrypt all Aadhaar numbers using AES-256 before storage
2. THE HaqDaari_System SHALL never log or display full Aadhaar numbers (only last 4 digits)
3. THE HaqDaari_System SHALL obtain explicit consent before calling Aadhaar_eKYC or DigiLocker_API
4. THE HaqDaari_System SHALL store consent records with timestamp, purpose, and expiry date
5. THE HaqDaari_System SHALL implement role-based access control for CSC_Operators and administrators
6. THE HaqDaari_System SHALL log all data access events for audit purposes
7. THE HaqDaari_System SHALL comply with Aadhaar Act 2016 and Digital Personal Data Protection Act 2023
8. THE HaqDaari_System SHALL use HTTPS for all API communications
9. THE HaqDaari_System SHALL implement rate limiting to prevent abuse

### Requirement 12: Language Support

**User Story:** As a Hindi-speaking citizen with limited English proficiency, I want to interact with the system in Hindi, so that I can understand and use it effectively.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL support Hindi language for all user-facing messages
2. THE HaqDaari_System SHALL use Amazon Transcribe for Hindi speech-to-text conversion
3. THE HaqDaari_System SHALL use Amazon Polly for Hindi text-to-speech conversion
4. THE Shadow_Mode previews SHALL be generated in simple Hindi language
5. THE HaqDaari_System SHALL detect language preference from the first user message
6. THE HaqDaari_System SHALL allow users to switch between Hindi and English at any time
7. THE Scheme_Rules SHALL be available in both Hindi and English

### Requirement 13: Error Handling and Resilience

**User Story:** As a citizen using the system in areas with poor connectivity, I want the system to handle failures gracefully and retry automatically, so that I can complete my tasks despite network issues.

#### Acceptance Criteria

1. IF an India_Stack API call fails, THEN THE HaqDaari_System SHALL retry up to 3 times with exponential backoff
2. IF all retries fail, THEN THE HaqDaari_System SHALL notify the Citizen with a clear error message and suggest alternative actions
3. WHEN the CSC_Co_Pilot loses internet connectivity, THE system SHALL continue operating in offline mode without data loss
4. THE HaqDaari_System SHALL validate all user inputs before processing
5. IF invalid data is detected, THEN THE HaqDaari_System SHALL request correction with specific guidance
6. THE HaqDaari_System SHALL implement circuit breakers for external API calls to prevent cascade failures
7. THE HaqDaari_System SHALL log all errors to Amazon CloudWatch for monitoring and debugging

### Requirement 14: Analytics and Reporting

**User Story:** As a welfare officer, I want to see aggregated statistics on scheme uptake and citizen demographics, so that I can improve welfare program effectiveness.

#### Acceptance Criteria

1. THE HaqDaari_System SHALL track total users, schemes discovered, applications submitted, and successful enrollments
2. THE HaqDaari_System SHALL generate anonymized demographic reports showing scheme uptake by age, gender, and region
3. THE HaqDaari_System SHALL identify schemes with low awareness but high eligibility
4. THE HaqDaari_System SHALL provide a dashboard for welfare officers showing real-time statistics
5. THE HaqDaari_System SHALL never expose personally identifiable information in reports
6. THE HaqDaari_System SHALL export reports in CSV and PDF formats

### Requirement 15: MVP Scope and Phasing

**User Story:** As a product manager, I want to launch an MVP for 10,000 users with core features, so that we can validate the solution before scaling.

#### Acceptance Criteria

1. THE MVP SHALL support 10,000 total users with up to 1,000 concurrent users
2. THE MVP SHALL include all 5 core features: Zero-Touch Eligibility Engine, 
   Scheme Arbitrage Detector, Shadow Mode, CSC Co-Pilot, and WhatsApp + PWA interface
3. THE MVP SHALL support 100 high-impact central government schemes initially
4. THE MVP SHALL operate in 3 pilot states (to be determined)
5. THE MVP SHALL include basic analytics dashboard
6. Phase 2 SHALL expand scheme coverage from 100 to 750+ schemes, add detailed 
   analytics dashboard for welfare officers, and scale to 1 crore users

