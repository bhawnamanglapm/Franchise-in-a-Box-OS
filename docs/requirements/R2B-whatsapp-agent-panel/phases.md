# R2B: WhatsApp AI Agent Panel: phases

| Phase | Goal | Entry | Activities | Exit | Time |
|---|---|---|---|---|---|
| **1. Brief** | Remove ambiguity before building | R1 1c + R3 final | Build brief, prompt pack, mock-data spec | Every Must feature has a prompt | 30 m (Decide block) |
| **2. Scaffold** | Correct shell and tokens | Brief | Prompt 1; check the hex values | Dark theme matches the brief exactly | 15 m |
| **3. Core flow** | Inbox → thread → rules → state machine | Scaffold | Prompts 2–5 | Simulated message can flag, claim and return | 70 m |
| **4. Proof of "working"** | Reviewer-driven interaction | Core flow | Prompt 6: simulate box, computed badge, SLA | Test steps 2–4 pass | 15 m |
| **5. Polish / stretch** | Depth if time remains | Test steps 2–4 pass | Prompt 7; optional LLM | Prompt 7 done or skipped | 10–30 m |
| **6. Ship** | Public and verified | Build complete | Deploy, 9-step test, one fix cycle | All 9 steps pass in incognito | 30 m |
| **7. Write-up** | Brief-required narrative | Shipped | From the build log only | F2B.W1–W5 complete | 15 m |
| **8. Link up** | One connected system | R2C and R2A shipped | Copy approved facts from R2C; footer links | F2B.21–F2B.22 done; redeploy before submission | 10 m |
