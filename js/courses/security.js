/* Course: Cybersecurity basics — 10 lessons + 20-question final exam. */
(window.BITWOOD_COURSES = window.BITWOOD_COURSES || []).push({
  id: "security",
  name: "Cybersecurity",
  title: "Cybersecurity Basics",
  color: "#ef4444",
  icon: "shield",
  theme: "volcano",
  blurb: "Protect yourself, your accounts and your apps from attackers.",
  topics: "passwords, 2FA, phishing, encryption, HTTPS, web attacks, networks, privacy and incident response",
  lessons: [
    {
      title: "Thinking like a defender",
      minutes: 5,
      summary: "What we protect, who attacks, and the CIA triad.",
      sections: [
        { h: "The CIA triad", p: ["Security protects three things: <b>Confidentiality</b> (only the right people can read data), <b>Integrity</b> (data isn't changed secretly) and <b>Availability</b> (systems work when people need them)."] },
        { h: "Threats and risk", p: ["A <b>threat</b> is something that could cause harm (a thief, a bug, a flood). A <b>vulnerability</b> is a weakness. <b>Risk</b> = how likely × how bad. Defenders fix the biggest risks first."] },
        { h: "Ethics", p: ["Only test systems you own or have written permission to test. Real security professionals are \"white hats\" — they protect people, not attack them."] }
      ],
      points: ["CIA: confidentiality, integrity, availability.", "Threat + vulnerability = risk.", "Only test with permission."],
      checks: [
        { q: "Which part of the CIA triad means \"data isn't secretly changed\"?", options: ["Integrity", "Confidentiality", "Availability", "Authentication"], answer: 0, explain: "Integrity = correct, unmodified data." },
        { q: "When is it OK to test a system for weaknesses?", options: ["Only when you own it or have permission", "Whenever you're curious", "When nobody is watching", "On weekends"], answer: 0, explain: "Permission first — always." }
      ]
    },
    {
      title: "Passwords & password managers",
      minutes: 6,
      summary: "Long, unique passwords — and a tool to remember them.",
      sections: [
        { h: "What makes a strong password?", p: ["<b>Length</b> beats complexity. A passphrase like <code>purple-castle-jumps-42</code> is much harder to crack than <code>P@ss1</code>. Never reuse passwords — if one site leaks, attackers try that password everywhere (<b>credential stuffing</b>)."] },
        { h: "Password managers", p: ["A <b>password manager</b> creates and remembers a unique random password for every site. You only remember one strong master password. Popular options include Bitwarden, 1Password and the ones built into browsers."] },
        { h: "Check for leaks", p: ["Services like <i>Have I Been Pwned</i> tell you if your email appeared in a data breach — then change that password."] }
      ],
      points: ["Long and unique beats short and complex.", "Never reuse passwords.", "Use a password manager."],
      checks: [
        { q: "Which password is strongest?", options: ["purple-castle-jumps-42", "P@ss1", "123456", "ada2010"], answer: 0, explain: "Long passphrases are very hard to guess." },
        { q: "Why is reusing passwords dangerous?", options: ["One leak lets attackers into all your accounts", "It makes typing slower", "Websites ban it", "It isn't dangerous"], answer: 0, explain: "That's credential stuffing." }
      ]
    },
    {
      title: "Two-factor authentication",
      minutes: 5,
      summary: "A second lock on your accounts.",
      sections: [
        { h: "Factors", p: ["Authentication factors are: something you <b>know</b> (password), something you <b>have</b> (phone, security key) and something you <b>are</b> (fingerprint). <b>2FA</b> requires two of them, so a stolen password alone isn't enough."] },
        { h: "Types of 2FA", p: ["From weaker to stronger: SMS codes → authenticator apps (6-digit codes that change every 30 seconds) → <b>passkeys</b> and hardware security keys, which also resist phishing."] }
      ],
      points: ["2FA = two different factors.", "Authenticator apps beat SMS.", "Passkeys and security keys resist phishing."],
      checks: [
        { q: "What does 2FA add?", options: ["A second proof of identity besides the password", "A second password of the same kind", "A faster login", "A longer username"], answer: 0, explain: "Two different factors." },
        { q: "Which is a \"something you have\" factor?", options: ["Your phone with an authenticator app", "Your password", "Your fingerprint", "Your username"], answer: 0, explain: "A device you possess." }
      ]
    },
    {
      title: "Phishing & social engineering",
      minutes: 6,
      summary: "Attacks that trick people instead of computers.",
      sections: [
        { h: "Phishing", p: ["A <b>phishing</b> message pretends to be someone you trust (a bank, a teacher, a game) to make you click a link, open a file or type your password on a fake page."] },
        { h: "Red flags", p: ["Urgency (\"your account will be deleted in 1 hour!\"), unexpected attachments, strange sender addresses, spelling mistakes and links whose real address doesn't match. Hover over a link to see where it really goes."],
          code: "Shown text:  https://bitwood.example/login\nReal link:   https://bitw00d-login.example.ru/steal", lang: "text" },
        { h: "What to do", p: ["Don't click — go to the website yourself by typing its address. Never share passwords or 2FA codes; real companies never ask for them. Report the message."] }
      ],
      points: ["Phishing fakes a trusted sender.", "Watch for urgency, odd links and attachments.", "Never share passwords or codes."],
      checks: [
        { q: "Which is a phishing red flag?", options: ["\"Act now or your account is deleted!\"", "A newsletter you subscribed to", "A message from a friend you were expecting", "A bill you ordered"], answer: 0, explain: "Urgency and fear are classic tricks." },
        { q: "A message asks for your 2FA code. What do you do?", options: ["Never share it — real services don't ask", "Send it quickly", "Post it publicly", "Reply with your password instead"], answer: 0, explain: "Codes are for you only." }
      ]
    },
    {
      title: "Encryption & hashing",
      minutes: 7,
      summary: "Scrambling data so only the right people can read it.",
      sections: [
        { h: "Encryption", p: ["<b>Encryption</b> turns readable data (plaintext) into scrambled ciphertext using a <b>key</b>. Only someone with the right key can decrypt it."],
          diagram: "encryption" },
        { h: "Symmetric and asymmetric", p: ["<b>Symmetric</b> encryption uses one shared key (fast, e.g. AES). <b>Asymmetric</b> encryption uses a key pair: a <b>public key</b> anyone can use to encrypt, and a <b>private key</b> only the owner has to decrypt (e.g. RSA)."] },
        { h: "Hashing", p: ["A <b>hash</b> is a one-way fingerprint of data — you can't turn it back. Websites store password hashes (with bcrypt/argon2), and hashes prove a file wasn't changed."],
          code: "sha256(\"hello\") → 2cf24dba5fb0a30e26e83b2ac5b9e29e...\nsha256(\"hellp\") → completely different", lang: "text" }
      ],
      points: ["Encryption is reversible with the key.", "Symmetric = one key; asymmetric = public + private key.", "Hashing is one-way."],
      checks: [
        { q: "In asymmetric encryption, who should have the private key?", options: ["Only its owner", "Everyone", "The website visitors", "Nobody — it's printed publicly"], answer: 0, explain: "The private key must stay secret." },
        { q: "What is special about a hash?", options: ["It can't be turned back into the original data", "It's always reversible", "It's a type of password manager", "It only works on images"], answer: 0, explain: "Hashes are one-way." }
      ]
    },
    {
      title: "HTTPS & web safety",
      minutes: 6,
      summary: "The padlock in your browser — what it means and what it doesn't.",
      sections: [
        { h: "HTTPS", p: ["<b>HTTPS</b> = HTTP + <b>TLS</b> encryption. It keeps data private and unchanged between your browser and the server, and a <b>certificate</b> proves you're talking to the real domain."],
          diagram: "https" },
        { h: "What the padlock doesn't mean", p: ["The padlock means the <i>connection</i> is encrypted — not that the site is honest. Phishing sites can have HTTPS too. Always check the domain name."] },
        { h: "Public Wi-Fi", p: ["On public Wi-Fi, use HTTPS sites, avoid entering sensitive data on unknown networks, and keep your device updated."] }
      ],
      points: ["HTTPS encrypts traffic with TLS.", "Certificates prove the domain's identity.", "A padlock ≠ a trustworthy site."],
      checks: [
        { q: "What does HTTPS protect?", options: ["Data travelling between browser and server", "Your computer from all viruses", "Your passwords on every website forever", "The website's design"], answer: 0, explain: "It secures the connection." },
        { q: "Can a phishing site have a padlock?", options: ["Yes — always check the domain", "No, never", "Only on phones", "Only on Fridays"], answer: 0, explain: "Anyone can get a certificate for their own domain." }
      ]
    },
    {
      title: "Web attacks",
      minutes: 8,
      summary: "XSS, SQL injection and CSRF — and how developers stop them.",
      sections: [
        { h: "Injection", p: ["<b>SQL injection</b> happens when user input is glued into a database query and runs as code. The fix: <b>parameterized queries</b>."] },
        { h: "XSS", p: ["<b>Cross-site scripting</b> (XSS) happens when a site shows user input as HTML, letting an attacker run JavaScript in other people's browsers. The fix: escape output (use <code>textContent</code>, not <code>innerHTML</code>) and set a Content Security Policy."],
          code: "// ❌ comment shown as HTML — a <script> in it would run\nbox.innerHTML = comment;\n// ✅ shown as plain text\nbox.textContent = comment;", lang: "js" },
        { h: "CSRF and the OWASP Top 10", p: ["<b>CSRF</b> tricks a logged-in browser into sending a request the user didn't intend; fix it with CSRF tokens and <code>SameSite</code> cookies. The <b>OWASP Top 10</b> lists the most common web risks — every web developer should know it."] }
      ],
      points: ["SQL injection → parameterized queries.", "XSS → escape output, avoid innerHTML with user data.", "OWASP Top 10 = the common web risks."],
      checks: [
        { q: "What causes XSS?", options: ["Showing user input as HTML so scripts can run", "A slow server", "A weak Wi-Fi password", "Too many images"], answer: 0, explain: "Escape user content before displaying it." },
        { q: "What prevents SQL injection?", options: ["Parameterized queries", "Bigger fonts", "Using HTTP instead of HTTPS", "Shorter passwords"], answer: 0, explain: "Keep input separate from SQL code." }
      ]
    },
    {
      title: "Networks & firewalls",
      minutes: 6,
      summary: "IP addresses, ports, firewalls and VPNs.",
      sections: [
        { h: "Addresses and ports", p: ["Every device on a network has an <b>IP address</b>. Services listen on <b>ports</b>: 80 for HTTP, 443 for HTTPS, 22 for SSH. <b>DNS</b> turns names like <code>example.com</code> into IP addresses."] },
        { h: "Firewalls", p: ["A <b>firewall</b> allows or blocks traffic based on rules — for example \"allow 443 from anywhere, allow 22 only from the office\". Close every port you don't need."] },
        { h: "VPNs", p: ["A <b>VPN</b> creates an encrypted tunnel to another network. Companies use VPNs to reach internal systems safely."] }
      ],
      points: ["IP = address, port = which service.", "Firewalls allow/block by rules — close unused ports.", "VPNs tunnel traffic securely."],
      checks: [
        { q: "Which port does HTTPS normally use?", options: ["443", "22", "25", "3306"], answer: 0, explain: "80 = HTTP, 443 = HTTPS." },
        { q: "What does a firewall do?", options: ["Allows or blocks network traffic by rules", "Speeds up Wi-Fi", "Stores passwords", "Encrypts files on disk"], answer: 0, explain: "It's a traffic gatekeeper." }
      ]
    },
    {
      title: "Malware & updates",
      minutes: 5,
      summary: "Viruses, ransomware — and the boring habit that stops most of them.",
      sections: [
        { h: "Kinds of malware", p: ["<b>Viruses</b> and <b>worms</b> spread; <b>trojans</b> hide inside harmless-looking programs; <b>ransomware</b> encrypts your files and demands payment; <b>spyware</b> secretly watches you."] },
        { h: "Defence", p: ["Keep your system and apps <b>updated</b> (updates patch vulnerabilities), install software only from official sources, don't open unexpected attachments, and keep <b>backups</b> — the best answer to ransomware."] }
      ],
      points: ["Malware types: virus, worm, trojan, ransomware, spyware.", "Updates patch known holes.", "Backups beat ransomware."],
      checks: [
        { q: "What does ransomware do?", options: ["Encrypts your files and demands payment", "Speeds up your computer", "Backs up your files", "Blocks spam"], answer: 0, explain: "Backups let you recover without paying." },
        { q: "Why install updates quickly?", options: ["They fix known security holes", "They change the wallpaper", "They delete viruses' names", "They aren't important"], answer: 0, explain: "Attackers exploit known, unpatched bugs." }
      ]
    },
    {
      title: "Privacy & incident response",
      minutes: 6,
      summary: "Share less, and know what to do when something goes wrong.",
      sections: [
        { h: "Privacy", p: ["Share less personal info online, check app permissions, and think before posting — the internet remembers. Developers should collect only the data they truly need (<b>data minimisation</b>) and follow laws like GDPR."] },
        { h: "If you get hacked", p: ["1. Change the password (from a safe device) and turn on 2FA. 2. Log out of other sessions. 3. Check recovery email/phone. 4. Tell people if your account sent scams. 5. Learn what happened."] },
        { h: "Incident response for teams", p: ["Companies follow a plan: <b>prepare → detect → contain → eradicate → recover → learn</b>. Logs, backups and a calm checklist make all the difference."] }
      ],
      points: ["Share and collect only the data you need.", "Hacked? Change password, enable 2FA, end sessions.", "Prepare → detect → contain → eradicate → recover → learn."],
      checks: [
        { q: "Your account was hacked. What's the first step?", options: ["Change the password from a safe device and enable 2FA", "Delete your computer", "Ignore it", "Post your new password online"], answer: 0, explain: "Lock the attacker out first." },
        { q: "What is data minimisation?", options: ["Collecting only the data you really need", "Compressing images", "Deleting all backups", "Using short variable names"], answer: 0, explain: "Less data = less to leak." }
      ]
    }
  ],
  exam: [
    { q: "What does the \"C\" in the CIA triad stand for?", options: ["Confidentiality", "Computers", "Cookies", "Code"], answer: 0, explain: "Confidentiality, Integrity, Availability." },
    { q: "Which keeps systems working when people need them?", options: ["Availability", "Integrity", "Encryption only", "Phishing"], answer: 0, explain: "Availability = uptime." },
    { q: "What is a vulnerability?", options: ["A weakness that could be exploited", "A strong password", "A firewall rule", "A backup"], answer: 0, explain: "Threats exploit vulnerabilities." },
    { q: "What makes a password strongest?", options: ["Length and being unique", "Using your birthday", "Using only numbers", "Reusing it everywhere"], answer: 0, explain: "Long, unique passphrases." },
    { q: "What is credential stuffing?", options: ["Trying leaked passwords on many other sites", "A password manager feature", "A type of encryption", "Saving passwords in a browser"], answer: 0, explain: "That's why you never reuse passwords." },
    { q: "What does a password manager do?", options: ["Creates and stores unique passwords for you", "Shares your passwords publicly", "Removes the need for any password", "Hacks other accounts"], answer: 0, explain: "You remember one master password." },
    { q: "Which 2FA method best resists phishing?", options: ["Passkeys / hardware security keys", "SMS codes", "Security questions", "Email reminders"], answer: 0, explain: "They check the real website automatically." },
    { q: "What is phishing?", options: ["A fake message that tricks you into giving info or clicking", "A way to speed up the internet", "A firewall setting", "A backup method"], answer: 0, explain: "Social engineering through fake messages." },
    { q: "How can you see where a link really goes?", options: ["Hover over it before clicking", "Click it twice", "Read the email subject", "Trust the text of the link"], answer: 0, explain: "The shown text can lie." },
    { q: "What does encryption need to decrypt data?", options: ["The right key", "A faster computer", "A screenshot", "The file name"], answer: 0, explain: "Without the key, ciphertext is unreadable." },
    { q: "In asymmetric encryption, which key can be shared with everyone?", options: ["The public key", "The private key", "Both", "Neither"], answer: 0, explain: "Public to encrypt, private to decrypt." },
    { q: "Why do websites store password hashes instead of passwords?", options: ["Hashes can't be reversed if the database leaks", "Hashes are shorter to type", "Browsers require it", "Hashes are prettier"], answer: 0, explain: "Use slow hashes like bcrypt/argon2." },
    { q: "What does the HTTPS padlock tell you?", options: ["The connection is encrypted", "The site is definitely honest", "The site has no bugs", "You're anonymous"], answer: 0, explain: "Encrypted ≠ trustworthy — check the domain." },
    { q: "What protocol does HTTPS use for encryption?", options: ["TLS", "FTP", "DNS", "SSH"], answer: 0, explain: "HTTP over TLS." },
    { q: "How do developers prevent XSS?", options: ["Escape user content (e.g. textContent instead of innerHTML)", "Use bigger servers", "Disable HTTPS", "Store passwords in cookies"], answer: 0, explain: "Never render user input as HTML." },
    { q: "What is the OWASP Top 10?", options: ["A list of the most common web security risks", "The ten fastest websites", "A password manager", "A firewall brand"], answer: 0, explain: "Required reading for web developers." },
    { q: "Which port does SSH use by default?", options: ["22", "80", "443", "8080"], answer: 0, explain: "SSH = 22." },
    { q: "What does DNS do?", options: ["Turns domain names into IP addresses", "Encrypts files", "Blocks malware", "Stores passwords"], answer: 0, explain: "Like a phone book for the internet." },
    { q: "What is the best protection against losing files to ransomware?", options: ["Regular, tested backups", "Paying the ransom", "Turning off the monitor", "Using a longer username"], answer: 0, explain: "Restore from backup instead of paying." },
    { q: "Your account was hacked. Which step comes first?", options: ["Secure it: change the password and enable 2FA", "Wait a week", "Tell nobody", "Create the same password again"], answer: 0, explain: "Contain first, then investigate." }
  ]
});
