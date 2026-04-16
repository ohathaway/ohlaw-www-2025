// Bankruptcy engagement letter templates.
// Content sourced from actual DOCX templates
// in /doc directory.

import { getFees } from './fees'

export const TEMPLATE_TYPES = {
  ch7_single: 'Chapter 7 — Individual',
  ch7_joint: 'Chapter 7 — Joint',
  ch13_single: 'Chapter 13 — Individual',
  ch13_joint: 'Chapter 13 — Joint',
}

const baseFields = [
  'clientName',
  'clientLastName',
  'clientPrefix',
  'clientAddress',
  'date',
  'attorneyFee',
  'hourlyRate',
]

const jointFields = [
  ...baseFields,
  'jointClientName',
  'jointClientPrefix',
]

const ch13Fields = [
  ...baseFields,
  'prePetitionFee',
  'postPetitionFee',
]

const ch13JointFields = [
  ...jointFields,
  'prePetitionFee',
  'postPetitionFee',
]

const templateFields = {
  ch7_single: baseFields,
  ch7_joint: jointFields,
  ch13_single: ch13Fields,
  ch13_joint: ch13JointFields,
}

export const getTemplateVariables = type =>
  templateFields[type] ?? []

const fmt = amount =>
  `$${Number(amount).toLocaleString('en-US', {
    minimumFractionDigits: 0,
  })}`

const isJoint = type =>
  type.includes('joint')

// ─── BK7 Single (v2 format) ───

const renderCh7Single = (vars, fees) => {
  const creditReport = fees.backgroundCheck
  const totalFee = Number(vars.attorneyFee)
    + fees.filingFee + creditReport

  return `
<p>${vars.date}</p>

<p>Dear ${vars.clientPrefix}.
${vars.clientLastName}:</p>

<p>Thank you for choosing us to represent you
in your bankruptcy proceeding. Bankruptcy is a
difficult decision to make, and an even more
difficult process to go through. We honor the
trust you have placed in us to help guide you
through this time.</p>

<p>You will find all the legal terms of our
representation on the next page, please read
them. We also want to highlight a few things
here.</p>

<ul>
  <li>We can't represent you with your creditors
  until you have paid your $100 down payment.</li>
  <li>We earn our fees in increments as we work
  on your case. Please read the details on
  the next page.</li>
  <li>Preparing a bankruptcy petition is a joint
  effort between you and us. We will work hard
  to help you understand the process and what
  we need from you. We also need you to work
  hard to find the documents and information
  we need to get this thing done.</li>
  <li>The only bad question is the one you don't
  ask us. If you're unsure about anything at
  all, ask us. We're on your side, so we won't
  judge.</li>
  <li>Heavy consequences, including jail time,
  steep fines, and revoking the bankruptcy
  discharge can happen when you don't tell the
  truth, the whole truth and nothing but the
  truth. It's better to talk a problem through
  with us and make a plan than put yourself in
  a bad place with the bankruptcy court.</li>
</ul>

<p>The total cost of your bankruptcy breaks down
as follows. Please read the full payment terms
on the next page.</p>

<table>
  <tr>
    <td>Our fees</td>
    <td>${fmt(vars.attorneyFee)}</td>
  </tr>
  <tr>
    <td>Court filing fees</td>
    <td>${fmt(fees.filingFee)}</td>
  </tr>
  <tr>
    <td>Tri-merge credit report</td>
    <td>${fmt(creditReport)}</td>
  </tr>
  <tr>
    <td><strong>Total Fees</strong></td>
    <td><strong>${fmt(totalFee)}</strong></td>
  </tr>
</table>

<p>This is probably going to be some hard work,
but we are here to get you through it.</p>

<p>Very truly yours,</p>
<p>Owen Hathaway, Managing Attorney</p>

<h2>Terms and Conditions</h2>

<ol>
  <li><strong>Scope of Services.</strong> Pending
  payment of the $100 down payment, you have
  hired us to provide Chapter 7 Bankruptcy
  Services. Services include all representation
  to complete your legal matter except adversary
  proceedings ("Additional Services"). Additional
  Services are billed at ${vars.hourlyRate}
  per hour for attorney time and $125.00 per
  hour for paralegal time.</li>

  <li><strong>Fees.</strong> We agree to represent
  you under a "FLAT FEE" arrangement. We agree
  to provide Services for a fixed amount of
  ${fmt(vars.attorneyFee)}, plus the Court
  filing fee of ${fmt(fees.filingFee)} and a
  credit report expense of ${fmt(creditReport)}
  for a total Flat Fee of
  ${fmt(totalFee)} ("Total Flat Fee").
  Because this is a flat fee representation,
  we will not provide a monthly accounting.
  Fees will be placed into our COLTAF client
  trust fund account. As each Stage of
  representation as described below is
  completed, we will withdraw from the COLTAF
  an amount equal to the Total Flat Fee
  multiplied by the percentage of work
  attributed to the Stage. The Stages are
  as follows:
    <ol>
      <li>Stage 1 – Initial consultation, $100
      of Total Flat Fee earned on completion
      of initial consultation and advice.</li>
      <li>Stage 2 – File Setup, an additional
      35% of Total Flat Fee earned on completion
      of file setup.</li>
      <li>Stage 3 – Petition preparation, an
      additional 35% of Total Flat Fee earned
      on completion of draft bankruptcy petition,
      we may have requested additional needed
      information from you.</li>
      <li>Stage 4 – Petition filing, 15% Total
      Flat Fee drawn on completion of i) petition
      review meeting; and ii) filing of petition
      with the Court.</li>
      <li>Stage 5 – Post-filing services,
      Remaining Total Flat Fee drawn on
      completion of representation at Section
      341 Meeting of Creditors.</li>
    </ol>
  </li>
</ol>

<p>You have 90 days from the final payment of
Fees to turn in all requested documents or,
if we have to spend additional time collecting
documents due to your unreasonable delay, you
may be charged an Additional Fee of $375.00,
and any amounts on deposit with us to pay
filing fees or other costs will be applied
toward that $375.00 Fee. No Chapter 7 petition
will be filed until all Fees and costs are
paid in full and you provide all documents.
The Additional Fee may increase if you give
inaccurate information.</p>

<ol start="3">
  <li><strong>Payment Term and Authorization.
  </strong> You agree to only use a debit card,
  and not a credit card to pay for Services.
  If we have agreed to do so separately, you
  authorize us to charge your account under a
  payment plan to fully pay all fees. You may
  cancel future payments only by written notice.
  This authorization is effective until you have
  paid all fees or have cancelled the
  authorization. Our authority to deduct funds
  from Client's account ceases upon payment in
  full of all fees. We are not responsible for
  damages/costs/fees related to authorized
  payments. You will be charged $38.00 for each
  bounced payment.</li>

  <li><strong>Virtual Representation.</strong>
  We represent you primarily through means of
  telephonic and online communication via email,
  phone or computer-based virtual meeting room,
  and not face-to-face at a physical office.
  You have elected to use us, in part, because
  you find this service more efficient and
  convenient. You have the right to meet with
  your attorney in person at a mutually
  agreeable time and location.</li>

  <li><strong>Refunds.</strong> If you cancel
  the Services, you will be charged for all
  Services up to the date of cancellation.
  We will provide an accounting along with
  payment of any unearned portion of the
  Fee.</li>

  <li><strong>Debtor's Obligations to Pay
  Credit Counseling/Debtor Education.</strong>
  Our Flat Fee does not include the required
  Pre-filing credit counseling and post-filing
  debtor education instructional courses.</li>

  <li><strong>Consent to Receive SMS/Text
  Messages.</strong> You consent to receive
  SMS/Text messages from us. We will use these
  messages only to communicate with you on the
  status of your case. We will not send
  marketing messages. We cannot represent you
  effectively if we cannot communicate with
  you, so we may terminate our representation
  if you withdraw this consent.</li>
</ol>

<h2>Electronic Signature Disclosure</h2>
<p>By signing this document electronically,
you consent to the use of electronic records
and signatures pursuant to the federal
Electronic Signatures in Global and National
Commerce Act (ESIGN) and the Uniform Electronic
Transactions Act (UETA). You acknowledge that
your electronic signature has the same legal
force and effect as a handwritten signature.</p>
`.trim()
}

// ─── BK7 Joint ───

const renderCh7Joint = (vars, fees) => {
  const creditReport = fees.backgroundCheck
  const courseFees = 20
  const totalFee = Number(vars.attorneyFee)
    + fees.filingFee + creditReport + courseFees

  return `
<p>${vars.date}</p>

<p><strong>Re: Engagement of The Law Offices of
Owen Hathaway, LLC</strong></p>

<p>Dear ${vars.clientPrefix}. and
${vars.jointClientPrefix}.
${vars.clientLastName}:</p>

<p>We are pleased to represent you in your
Chapter 7 bankruptcy. Our firm provides a fee
arrangement letter to clients to set forth the
terms of representation. It has been our
experience that clients appreciate having a
letter of agreement regarding fees. A copy of
our Fees and Other Policies Statement is found
on our website.</p>

<p>We normally bill on an hourly basis for the
time involved on your file; however, in this
case, you and I agree on a flat fee of
${fmt(vars.attorneyFee)} plus filing costs.
You are also responsible for certain fees that
we will pay on your behalf. These fees
breakdown as follows:</p>

<table>
  <tr>
    <td>Our fees</td>
    <td>${fmt(vars.attorneyFee)}</td>
  </tr>
  <tr>
    <td>Court filing fees</td>
    <td>${fmt(fees.filingFee)}</td>
  </tr>
  <tr>
    <td>Tri-merge credit report</td>
    <td>${fmt(creditReport)}</td>
  </tr>
  <tr>
    <td>Money Sharp Credit Counseling course</td>
    <td>$10</td>
  </tr>
  <tr>
    <td>Money Sharp Financial Management course</td>
    <td>$10</td>
  </tr>
  <tr>
    <td><strong>Total Fees payable to our firm:
    </strong></td>
    <td><strong>${fmt(totalFee)}</strong></td>
  </tr>
</table>

<p>Because most of our clients are in a
difficult financial position, we offer everyone
a flexible fee payment plan. We will start
working on your case once you've paid $100.
You may pay the rest of your fees when you are
able in as many payments as it takes. Fees
you've paid are fully refundable less any
expenses until we've filed your case with
the court.</p>

<p>The court requires us to collect all fees and
costs prior to filing your Bankruptcy Petition.
In addition, we will require you to provide us
with sufficient information to prepare and
complete the Bankruptcy Petition and Schedules
and Statement of Financial Affairs.</p>

<p>We can offer a flat fee arrangement because
the attorney time in the file is predictable
and will be limited generally to the following
services:</p>

<ol>
  <li>Analysis of your financial situation and
  giving you advice in determining whether to
  file a Petition in Bankruptcy;</li>
  <li>Preparation and filing of any Petition,
  Schedules, Statement of Financial Affairs
  which may be required;</li>
  <li>Representation of you at the §341 hearing
  (your meeting of creditors) and any adjourned
  §341 hearings.</li>
</ol>

<p>This fee arrangement does not cover any
services requested after the §341 hearing and
it does not include any Adversary Proceedings
commenced against you or at your request.
Services in addition to those outlined above
will be on an hourly basis at my hourly rate
of ${vars.hourlyRate}.</p>

<p>Because the information contained in the
Bankruptcy Schedules and Statement of Financial
Affairs is a "snapshot" of your finances on a
given date, timely response and cooperation on
your part is necessary to avoid duplicate work.
Therefore, we ask that you respond promptly to
requests for information and updating of or
correcting of the draft paperwork which we will
ask for your review. <em>If an amendment to your
Schedules to add creditors or change information
previously given to us is required, and if this
amendment is necessary or appropriate after the
initial Bankruptcy Schedules are filed, you will
be charged a fee for amendment.</em></p>

<p>We expect to provide you with excellent legal
representation at reasonable and fair fees,
consistent with the scope and complexity of our
assignment. You should always feel free to
question any aspect of our representation or
our billings. In turn, we require your full
cooperation, timely response to our needs for
information and prompt attention to our
invoices.</p>

<p>We will file your case only when we are
satisfied that you have completely and
accurately disclosed all of your assets and
liabilities and when all of the fees and
expenses associated with your case have been
satisfied.</p>

<p>Please indicate your acceptance of this
engagement by signing below. We appreciate this
opportunity to serve you and look forward to a
good working relationship with you.</p>

<p>Very truly yours,</p>
<p>Owen Hathaway, Managing Attorney</p>

<h2>Electronic Signature Disclosure</h2>
<p>By signing this document electronically,
you consent to the use of electronic records
and signatures pursuant to the federal
Electronic Signatures in Global and National
Commerce Act (ESIGN) and the Uniform Electronic
Transactions Act (UETA). You acknowledge that
your electronic signature has the same legal
force and effect as a handwritten signature.</p>
`.trim()
}

// ─── Ch13 Exhibit A (shared) ───

const exhibitA = `
<h2>EXHIBIT A</h2>
<h3>BASIC SERVICES ANTICIPATED IN
CHAPTER 13 CASES</h3>

<p>The following services are Basic Services
common to most Chapter 13 cases. Some cases
will not require all of these services, but
such services are considered essential to
competent and effective representation of
most debtors in Chapter 13.</p>

<ol>
  <li>Meet with the debtor(s) to review and
  analyze the debtor(s)' financial
  situation.</li>
  <li>Counsel the debtor(s) on whether the
  filing of a bankruptcy case is appropriate
  and necessary and, if so, whether to file
  a Chapter 7 or Chapter 13 case.</li>
  <li>Advise the debtor(s) of their statutory
  obligations once a bankruptcy is filed, both
  pre and post-confirmation.</li>
  <li>Evaluate the timing of the filing.</li>
  <li>Evaluate conflict of interest issues.</li>
  <li>Explain to the debtor(s) the nature and
  amount of fees and expenses to be charged
  for the Basic Services. Provide the debtor(s)
  with a copy of this Exhibit A of Basic
  Services.</li>
  <li>If required to e-file, e-file all
  documents on debtors behalf.</li>
  <li>Analyze eligibility for discharge.</li>
  <li>Prepare and file required documents,
  including, but not limited to, the schedules
  and statement of affairs and Form B22 C,
  Statement of Current Monthly Income, and
  other information required to be filed by
  section 521(a) of the Code.</li>
  <li>Assist the debtor(s) in formulating a
  budget and Chapter 13 plan.</li>
  <li>Respond to creditor inquiries.</li>
  <li>Timely supply requested information
  to the Chapter 13 Trustee.</li>
  <li>Advise the debtor(s) with regard to
  the automatic stay.</li>
  <li>Take appropriate action with respect
  to the automatic stay.</li>
  <li>Appear at and represent the debtor(s)
  at the § 341 meeting of creditors.</li>
  <li>Review claims filed by the final hearing
  on confirmation and account for them in
  the plan.</li>
  <li>Represent the debtor(s) in negotiations
  with the Chapter 13 Trustee.</li>
  <li>Prepare and file any necessary amendments
  to schedules, statements and proposed
  plans.</li>
  <li>Where Debtor(s) own real estate or has
  lawsuits, obtain a lien search and if
  applicable, prepare and file motions for
  avoidance of liens.</li>
  <li>Represent the debtor(s) at any Rule 2004
  examination.</li>
  <li>File or object to proofs of claim,
  as necessary.</li>
  <li>If appropriate, prepare and file
  responses to motions and appear at any
  hearings.</li>
  <li>Represent debtors in plan confirmation
  process and attend hearing if necessary on
  objections to confirmation.</li>
  <li>Prepare all proposed orders and give all
  notices as required.</li>
  <li>Comply with T.L.B.R. 1017 and 3015,
  11 U.S.C. §§ 521 and 1308</li>
</ol>
`.trim()

// ─── BK13 Single ───

const renderCh13Single = (vars, fees) => {
  const creditReport = fees.backgroundCheck
  const prePetition = Number(vars.prePetitionFee)
  const postPetition = Number(vars.postPetitionFee)
  const courseFees = 20
  const prePetitionTotal = prePetition
    + fees.filingFee + creditReport + courseFees
  const grandTotal = prePetitionTotal
    + postPetition

  return `
<p>${vars.date}</p>

<p>Re: Engagement of The Law Offices of
Owen Hathaway, LLC</p>

<p>Dear ${vars.clientPrefix}.
${vars.clientLastName}:</p>

<p>We are pleased to be representing you in your
Chapter 13 bankruptcy. Our firm provides a fee
arrangement letter to clients to set forth the
terms of representation. It has been our
experience that clients appreciate having a
letter of agreement regarding fees. A copy of
our Fees and Other Policies Statement is
enclosed – we think it provides important
information.</p>

<p>We normally bill on an hourly basis for the
time involved on your file; however, in this
case, you and I agree on a flat fee of
${fmt(vars.attorneyFee)} plus filing costs.
You agree to pay ${fmt(prePetition)} of the
flat fee prior to filing your Bankruptcy
Petition and the remainder of our fees through
your Chapter 13 repayment plan. You are also
responsible for certain fees that we will pay
on your behalf. All costs breakdown as
follows:</p>

<table>
  <tr>
    <td></td>
    <td><strong>Pre-Petition</strong></td>
    <td><strong>Post-Petition</strong><br />
    (paid through the Chapter 13 Plan)</td>
  </tr>
  <tr>
    <td>Our fees</td>
    <td>${fmt(prePetition)}</td>
    <td>${fmt(postPetition)}</td>
  </tr>
  <tr>
    <td>Court filing fees</td>
    <td>${fmt(fees.filingFee)}</td>
    <td></td>
  </tr>
  <tr>
    <td>Tri-merge credit report</td>
    <td>${fmt(creditReport)}</td>
    <td></td>
  </tr>
  <tr>
    <td>Money Sharp Credit Counseling course
    <br />(paid directly to moneysharp.org)</td>
    <td>$10</td>
    <td></td>
  </tr>
  <tr>
    <td>Money Sharp Financial Management course
    <br />(paid directly to moneysharp.org)</td>
    <td>$10</td>
    <td></td>
  </tr>
  <tr>
    <td><strong>Total Fees Payable to our firm:
    </strong></td>
    <td><strong>${fmt(prePetitionTotal)}</strong>
    </td>
    <td><strong>${fmt(postPetition)}</strong></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td><strong>${fmt(grandTotal)}</strong></td>
  </tr>
</table>

<p>Because most of our clients are in a
difficult financial position, we offer everyone
a flexible fee payment plan. We will start
working on your case once you've paid $100.
You may pay the rest of your fees when you are
able in as many payments as it takes. Fees
you've paid are fully refundable less any
expenses until we've filed your case with
the court.</p>

<p>In addition, we will require you to provide
us with sufficient information to prepare and
complete the Bankruptcy Petition, Schedules
and Statement of Affairs.</p>

<p>We can offer a flat fee arrangement because
the attorney time in the file is predictable
and will be limited generally to the services
listed on the enclosed EXHIBIT A - Basic
Services Anticipated In Chapter 13 Cases.
Services in addition to those listed on
Exhibit A will be billed on an hourly basis
at my hourly rate of ${vars.hourlyRate}.</p>

<p>Because the information contained in the
Bankruptcy Schedules and Statement of Affairs
is a "snapshot" of your finances on a given
date, timely response and cooperation on your
part is necessary to avoid duplicate work.
Therefore, we ask that you respond promptly to
requests for information and updating of or
correcting of the draft paperwork which we will
ask for your review. <em>If an amendment to your
Schedules to add creditors or change information
previously given to us is required, and if this
amendment is necessary or appropriate after the
initial Bankruptcy Schedules are filed, you will
be charged a fee for amendment.</em></p>

<p>We expect to provide you with excellent legal
representation at reasonable and fair fees,
consistent with the scope and complexity of our
assignment. You should always feel free to
question any aspect of our representation or
our billings. In turn, we require your full
cooperation, timely response to our needs for
information and prompt attention to our
invoices.</p>

<p>We will file your case only when we are
satisfied that you have completely and
accurately disclosed all of your assets and
liabilities and when all of the fees and
expenses associated with your case have been
satisfied.</p>

<p>Please indicate your acceptance of this
engagement by signing below. We appreciate this
opportunity to serve you and look forward to a
good working relationship with you.</p>

<p>Very truly yours,</p>
<p>Owen Hathaway, Managing Attorney</p>

<h2>Electronic Signature Disclosure</h2>
<p>By signing this document electronically,
you consent to the use of electronic records
and signatures pursuant to the federal
Electronic Signatures in Global and National
Commerce Act (ESIGN) and the Uniform Electronic
Transactions Act (UETA). You acknowledge that
your electronic signature has the same legal
force and effect as a handwritten signature.</p>

${exhibitA}
`.trim()
}

// ─── BK13 Joint ───

const renderCh13Joint = (vars, fees) => {
  const creditReport = fees.backgroundCheck
  const prePetition = Number(vars.prePetitionFee)
  const postPetition = Number(vars.postPetitionFee)
  const courseFees = 20
  const prePetitionTotal = prePetition
    + fees.filingFee + creditReport + courseFees
  const grandTotal = prePetitionTotal
    + postPetition

  return `
<p>${vars.date}</p>

<p>Re: Engagement of The Law Offices of
Owen Hathaway, LLC</p>

<p>Dear ${vars.clientPrefix}. and
${vars.jointClientPrefix}.
${vars.clientLastName}:</p>

<p>We are pleased to be representing you in your
Chapter 13 bankruptcy. Our firm provides a fee
arrangement letter to clients to set forth the
terms of representation. It has been our
experience that clients appreciate having a
letter of agreement regarding fees. A copy of
our Fees and Other Policies Statement is
enclosed – we think it provides important
information.</p>

<p>We normally bill on an hourly basis for the
time involved on your file; however, in this
case, you and I agree on a flat fee of
${fmt(vars.attorneyFee)} plus filing costs.
You agree to pay ${fmt(prePetition)} of the
flat fee prior to filing your Bankruptcy
Petition and the remainder of our fees through
your Chapter 13 repayment plan. You are also
responsible for certain fees that we will pay
on your behalf. All costs breakdown as
follows:</p>

<table>
  <tr>
    <td></td>
    <td><strong>Pre-Petition</strong></td>
    <td><strong>Post-Petition</strong><br />
    (paid through the Chapter 13 Plan)</td>
  </tr>
  <tr>
    <td>Our fees</td>
    <td>${fmt(prePetition)}</td>
    <td>${fmt(postPetition)}</td>
  </tr>
  <tr>
    <td>Court filing fees</td>
    <td>${fmt(fees.filingFee)}</td>
    <td></td>
  </tr>
  <tr>
    <td>Tri-merge credit report</td>
    <td>${fmt(creditReport)}</td>
    <td></td>
  </tr>
  <tr>
    <td>Money Sharp Credit Counseling course
    <br />(paid directly to moneysharp.org)</td>
    <td>$10</td>
    <td></td>
  </tr>
  <tr>
    <td>Money Sharp Financial Management course
    <br />(paid directly to moneysharp.org)</td>
    <td>$10</td>
    <td></td>
  </tr>
  <tr>
    <td><strong>Total Fees Payable to our firm:
    </strong></td>
    <td><strong>${fmt(prePetitionTotal)}</strong>
    </td>
    <td><strong>${fmt(postPetition)}</strong></td>
  </tr>
  <tr>
    <td></td>
    <td></td>
    <td><strong>${fmt(grandTotal)}</strong></td>
  </tr>
</table>

<p>Because most of our clients are in a
difficult financial position, we offer everyone
a flexible fee payment plan. We will start
working on your case once you've paid $100.
You may pay the rest of your fees when you are
able in as many payments as it takes. Fees
you've paid are fully refundable less any
expenses until we've filed your case with
the court.</p>

<p>In addition, we will require you to provide
us with sufficient information to prepare and
complete the Bankruptcy Petition, Schedules
and Statement of Affairs.</p>

<p>We can offer a flat fee arrangement because
the attorney time in the file is predictable
and will be limited generally to the services
listed on the enclosed EXHIBIT A - Basic
Services Anticipated In Chapter 13 Cases.
Services in addition to those listed on
Exhibit A will be billed on an hourly basis
at my hourly rate of ${vars.hourlyRate}.</p>

<p>Because the information contained in the
Bankruptcy Schedules and Statement of Affairs
is a "snapshot" of your finances on a given
date, timely response and cooperation on your
part is necessary to avoid duplicate work.
Therefore, we ask that you respond promptly to
requests for information and updating of or
correcting of the draft paperwork which we will
ask for your review. <em>If an amendment to your
Schedules to add creditors or change information
previously given to us is required, and if this
amendment is necessary or appropriate after the
initial Bankruptcy Schedules are filed, you will
be charged a fee for amendment.</em></p>

<p>We expect to provide you with excellent legal
representation at reasonable and fair fees,
consistent with the scope and complexity of our
assignment. You should always feel free to
question any aspect of our representation or
our billings. In turn, we require your full
cooperation, timely response to our needs for
information and prompt attention to our
invoices.</p>

<p>We will file your case only when we are
satisfied that you have completely and
accurately disclosed all of your assets and
liabilities and when all of the fees and
expenses associated with your case have been
satisfied.</p>

<p>Please indicate your acceptance of this
engagement by signing below. We appreciate this
opportunity to serve you and look forward to a
good working relationship with you.</p>

<p>Very truly yours,</p>
<p>Owen Hathaway, Managing Attorney</p>

<h2>Electronic Signature Disclosure</h2>
<p>By signing this document electronically,
you consent to the use of electronic records
and signatures pursuant to the federal
Electronic Signatures in Global and National
Commerce Act (ESIGN) and the Uniform Electronic
Transactions Act (UETA). You acknowledge that
your electronic signature has the same legal
force and effect as a handwritten signature.</p>

${exhibitA}
`.trim()
}

// ─── Dispatcher ───

const renderers = {
  ch7_single: renderCh7Single,
  ch7_joint: renderCh7Joint,
  ch13_single: renderCh13Single,
  ch13_joint: renderCh13Joint,
}

export const renderTemplate = async (type, vars) => {
  const required = getTemplateVariables(type)
  const missing = required.filter(
    f => !vars[f],
  )

  if (missing.length) {
    throw new Error(
      `Missing template fields: `
      + missing.join(', '),
    )
  }

  const fees = await getFees(type)
  if (!fees) {
    throw new Error(
      `No fee schedule found for: ${type}`,
    )
  }

  const renderer = renderers[type]
  if (!renderer) {
    throw new Error(
      `No template renderer for: ${type}`,
    )
  }

  return renderer(vars, fees)
}
