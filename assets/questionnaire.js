/* ═══════════════════════════════════════════════
   BRAGANDA SYSTEMS — Pre-Call Questionnaire Engine
   Multi-step assessment wizard. Renders into #qz-app.
═══════════════════════════════════════════════ */

(function () {
  'use strict';

  /* ── CONFIG ── */
  var SUBMIT_ENDPOINT = '/api/pre-call';
  var BOOKING_URL = 'https://calendly.com/bragandasystemsenquiry';
  var STORAGE_KEY = 'bg_questionnaire_v1';

  var NO_CRM = "We don't currently use a CRM";
  var SMALL_BIZ = '1–5';
  var AI_EMBEDDED = 'AI is embedded into several workflows';
  var AUTOMATION_NONE = 'None';

  /* ── HELPERS ── */
  function O(arr) { return arr.map(function (v) { return { value: v, label: v }; }); }

  /* ── STEP / FIELD DEFINITIONS ── */
  var STEPS = [
    {
      id: 'business', group: 'Business', title: 'Your Business',
      fields: [
        { id: 'company_name', type: 'text', label: 'Company name', required: true },
        { id: 'website', type: 'text', label: 'Website', required: true, placeholder: 'yourcompany.com' },
        { id: 'contact_name', type: 'text', label: 'Your name', required: true },
        { id: 'email', type: 'email', label: 'Work email', required: true },
        {
          id: 'industry', type: 'select', label: 'What industry are you in?', required: true,
          options: O(['SaaS / Technology', 'Financial Services / FinTech', 'Professional Services', 'Recruitment', 'Healthcare', 'Property / Construction', 'Ecommerce / Retail', 'Education', 'Manufacturing', 'Hospitality', 'Agency / Marketing', 'Other'])
        },
        {
          id: 'industry_other', type: 'text', label: 'Please specify your industry', required: true,
          showIf: function (a) { return a.industry === 'Other'; }
        },
        {
          id: 'business_model', type: 'select', label: 'What best describes your business model?', required: true,
          options: O(['B2B', 'B2C', 'B2B2C', 'SaaS / Subscription', 'Professional Services', 'Ecommerce', 'Marketplace', 'Other'])
        }
      ]
    },
    {
      id: 'understanding', group: 'Business', title: 'Understanding Your Business',
      fields: [
        {
          id: 'product_and_icp', type: 'textarea', required: true,
          label: 'What does your business sell, and who is your typical customer?',
          helper: 'Give us a short overview of what you sell, who normally buys it and the type of customer you want more of.'
        },
        {
          id: 'company_size', type: 'select', label: 'Approximately how many people work in the business?', required: true,
          options: O([SMALL_BIZ, '6–20', '21–50', '51–200', '200+'])
        },
        {
          id: 'markets', type: 'multiselect', label: 'Which markets do you primarily operate in?', required: true,
          options: O(['UK', 'Europe', 'US / Canada', 'Middle East', 'APAC', 'Global', 'Other'])
        }
      ]
    },
    {
      id: 'revenue', group: 'Revenue', title: 'Revenue & Sales',
      fields: [
        {
          id: 'average_customer_value', type: 'select', required: true,
          label: 'Approximately what is an average new customer or contract worth?',
          options: O(['Under £1,000', '£1,000–£5,000', '£5,000–£25,000', '£25,000–£100,000', '£100,000+', 'Varies significantly', 'Prefer not to say'])
        },
        {
          id: 'sales_cycle', type: 'select', required: true, label: 'What does your typical sales cycle look like?',
          options: O(['Same day', 'Under 1 week', '1–4 weeks', '1–3 months', '3–6 months', '6+ months', 'Varies'])
        },
        {
          id: 'monthly_lead_volume', type: 'select', required: true,
          label: 'Roughly how many new leads or enquiries do you receive each month?',
          options: O(['Under 25', '25–100', '100–500', '500–2,000', '2,000+', 'Not sure'])
        }
      ]
    },
    {
      id: 'lead_generation', group: 'Lead Generation', title: 'How You Generate Opportunities',
      fields: [
        {
          id: 'lead_sources', type: 'multiselect', required: true, label: 'Where do new opportunities currently come from?',
          options: O(['Website enquiries', 'Organic search / SEO', 'Paid search', 'Paid social', 'LinkedIn / social', 'Outbound sales', 'Purchased lead / data lists', 'Referrals', 'Partners', 'Events', 'Marketplaces / directories', 'Existing CRM / database', 'Other'])
        },
        {
          id: 'primary_lead_source', type: 'select', required: true, label: 'Which currently generates the most business?',
          dynamicOptions: function (a) {
            var chosen = a.lead_sources || [];
            return O(chosen.concat(['Not sure']));
          },
          showIf: function (a) { return (a.lead_sources || []).length > 0; }
        }
      ]
    },
    {
      id: 'lead_journey', group: 'Lead Journey', title: 'What Happens to a Lead?',
      fields: [
        {
          id: 'current_lead_process', type: 'textarea', required: true,
          label: 'Briefly describe what happens after a new lead or enquiry comes in.',
          helper: 'For example:', flow: 'Enquiry → qualification → CRM → sales rep → follow-up → meeting → proposal → customer'
        },
        {
          id: 'revenue_leakage', type: 'multiselect', required: true,
          label: 'Where do you think opportunities or revenue are currently being lost?',
          options: O(["Leads aren't contacted quickly enough", 'Follow-up is inconsistent', "Lead qualification isn't strong enough", 'Too much manual research', "Leads aren't routed correctly", 'CRM / data quality problems', "Systems don't communicate properly", 'Limited reporting or visibility', 'No structured nurture', "Existing database isn't used effectively", 'Low meeting / show rate', 'Low lead-to-customer conversion', 'Sales cycles are too long', 'Sales reps spend too much time on admin', "It's difficult to identify the best opportunities", "We're not sure", 'Other'])
        },
        {
          id: 'lead_response_time', type: 'select', required: true,
          label: 'Approximately how quickly is a new inbound lead normally contacted?',
          options: O(['Under 5 minutes', 'Under 30 minutes', 'Within a few hours', 'Same day', 'Next working day', 'Longer than one day', 'It varies', "We don't track this"])
        }
      ]
    },
    {
      id: 'systems', group: 'Technology', title: 'Your Systems',
      fields: [
        {
          id: 'crm', type: 'select', required: true, label: 'What CRM do you currently use?',
          options: O(['HubSpot', 'Salesforce', 'Zoho CRM', 'Pipedrive', 'Microsoft Dynamics', 'Other', NO_CRM])
        },
        {
          id: 'crm_other', type: 'text', required: true, label: 'Please specify your CRM',
          showIf: function (a) { return a.crm === 'Other'; }
        },
        {
          id: 'gtm_stack', type: 'textarea', required: false,
          label: 'What other platforms are important to your sales, marketing or customer journey?',
          helper: 'For example: email, marketing automation, forms, scheduling, enrichment, advertising, analytics, support, payment systems, AI tools or automation platforms.'
        },
        {
          id: 'integration_maturity', type: 'select', required: true, label: 'How well connected are your systems today?',
          options: O(['Highly integrated', 'Mostly connected', 'Some integrations', 'Lots of manual movement between platforms', 'Mainly spreadsheets / manual processes', 'Not sure']),
          showIf: function (a) { return a.crm !== NO_CRM; }
        }
      ]
    },
    {
      id: 'automation', group: 'Automation', title: 'Automation',
      fields: [
        {
          id: 'existing_automation', type: 'multiselect', required: true, label: 'Which processes are already automated?',
          options: O(['Lead capture', 'Lead routing', 'Lead qualification', 'Lead scoring', 'Outreach', 'Follow-up', 'Nurture', 'CRM updates', 'Prospect research', 'Data enrichment', 'Reporting', 'Customer support', 'Document processing', 'Finance / admin', AUTOMATION_NONE, 'Other']),
          exclusiveValue: AUTOMATION_NONE
        },
        {
          id: 'repetitive_process', type: 'textarea', required: true, prominent: true,
          label: "If you could remove ONE repetitive process from your team's workload tomorrow, what would it be?"
        }
      ]
    },
    {
      id: 'ai', group: 'AI', title: 'AI', headline: 'Where could AI create the biggest impact?',
      fields: [
        {
          id: 'ai_maturity', type: 'select', required: true, label: 'How are you currently using AI in the business?',
          options: O(['AI is embedded into several workflows', 'We use AI in a few operational processes', 'We mainly use tools like ChatGPT individually', "We're experimenting", "We're not using AI yet"])
        },
        {
          id: 'ai_existing_use_cases', type: 'textarea', required: false,
          label: "What AI tools or use cases are already working well for you?",
          showIf: function (a) { return a.ai_maturity === AI_EMBEDDED; }
        },
        {
          id: 'ai_opportunities', type: 'multiselect', required: true,
          label: 'Where do you think AI could have the biggest impact in your business?',
          options: O(['Lead qualification', 'Lead scoring / prioritisation', 'Prospect research', 'Account research', 'Personalised outreach', 'Follow-up and nurture', 'CRM / data entry', 'Data enrichment', 'Sales support', 'Customer service', 'Reporting and analysis', 'Forecasting', 'Customer health / retention', 'Document processing', 'Internal knowledge / search', 'Content creation', 'Finance / admin', 'Workflow decision-making', "I'm not sure yet", 'Other'])
        },
        {
          id: 'ai_reason', type: 'textarea', required: false, label: 'What makes you think this area could benefit from AI?',
          helper: 'For example: repetitive workload, research time, inconsistent decisions, poor data or difficulty scaling.'
        }
      ]
    },
    {
      id: 'measurement', group: 'Measurement', title: 'Measurement & Priorities',
      fields: [
        {
          id: 'metrics_tracked', type: 'multiselect', required: true, label: 'Which of these do you currently measure reliably?',
          options: O(['Lead volume', 'Lead response time', 'Cost per lead', 'Cost per acquisition / CAC', 'Lead-to-opportunity conversion', 'Opportunity-to-customer conversion', 'Meeting / show rate', 'Sales cycle length', 'Average customer / contract value', 'Customer lifetime value', 'Pipeline value', 'Source attribution', 'Revenue by channel', 'None / reporting is limited'])
        },
        { id: 'biggest_challenge', type: 'textarea', required: true, label: 'What is your biggest commercial or operational challenge right now?' },
        {
          id: 'desired_outcomes', type: 'multiselect', required: true, max: 3,
          label: 'What are you most hoping to improve?', helper: 'Choose up to three.',
          options: O(['Generate more qualified pipeline', 'Increase conversion', 'Respond to leads faster', 'Improve lead qualification', 'Improve sales follow-up', 'Reactivate existing leads / customers', 'Reduce manual admin', 'Improve CRM / data quality', 'Connect disconnected platforms', 'Improve reporting and visibility', 'Introduce AI into workflows', 'Reduce operating costs', 'Scale without increasing headcount', 'Shorten the sales cycle', 'Improve customer experience', 'Other'])
        }
      ]
    },
    {
      id: 'success', group: 'Priorities', title: 'What Does Success Look Like?',
      fields: [
        {
          id: 'success_definition', type: 'textarea', required: true, prominent: true,
          label: 'Six months from now, what would need to change for you to consider this project successful?'
        },
        {
          id: 'affected_users', type: 'select', required: true,
          label: 'Approximately how many people would use or be affected by the system?',
          options: O(['1–5', '6–15', '16–50', '51–100', '100+'])
        },
        {
          id: 'teams', type: 'multiselect', required: true, label: 'Which teams are likely to be involved?',
          options: O(['Marketing', 'Sales', 'RevOps', 'Customer Success', 'Operations', 'Finance', 'IT', 'Leadership', 'Other']),
          showIf: function (a) { return a.company_size !== SMALL_BIZ; }
        }
      ]
    },
    {
      id: 'implementation', group: 'Implementation', title: 'Training, Support & Governance',
      fields: [
        {
          id: 'training_requirement', type: 'select', required: true, label: 'What level of training or enablement might your team need?',
          options: O(['No training required', 'Basic user walkthrough', 'Team training', 'Admin / system-owner training', 'Training + documentation', 'Ongoing support and optimisation', "Not sure — we'd like your recommendation"])
        },
        {
          id: 'support_preference', type: 'select', required: true, label: 'What type of support would you prefer after implementation?',
          options: O(['Handover only', 'Short post-launch support', 'Ongoing monitoring and maintenance', 'Ongoing optimisation', 'Continued automation development', 'Not sure'])
        },
        {
          id: 'compliance', type: 'multiselect', required: true, label: 'Are there any security, privacy or compliance requirements we should know about?',
          options: O(['GDPR / personal data', 'Financial information', 'Healthcare / sensitive data', 'Internal security requirements', 'IT approval required', 'Procurement / vendor approval', 'Other', "None that I'm aware of"])
        }
      ]
    },
    {
      id: 'commercial', group: 'Commercial Fit', title: 'Final Questions', headline: 'Almost done.',
      sub: 'These last few questions help us understand the likely scope and make your session more useful.',
      fields: [
        {
          id: 'timeline', type: 'select', required: true, label: 'How soon would you ideally like to make improvements?',
          options: O(['Immediately', 'Within 1 month', '1–3 months', '3–6 months', '6+ months', "We're currently exploring"])
        },
        {
          id: 'decision_process', type: 'select', required: true, label: 'Who would normally be involved in approving a project like this?',
          options: O(['Me', 'Me + another stakeholder', 'Department head', 'Senior leadership', 'IT', 'Procurement', 'Several stakeholders', 'Not sure'])
        },
        {
          id: 'budget_range', type: 'select', required: false,
          label: 'If we identify a strong business case, what level of investment could realistically be considered?',
          options: O(['Under £2,500', '£2,500–£5,000', '£5,000–£10,000', '£10,000–£25,000', '£25,000+', "Budget hasn't been determined yet"])
        },
        { id: 'call_objective', type: 'textarea', required: true, label: 'What would you most like us to help you figure out during the call?' },
        { id: 'additional_information', type: 'textarea', required: false, label: 'Is there anything else we should know before speaking?' }
      ]
    }
  ];

  var TOTAL_STEPS = STEPS.length;

  /* ── STATE ── */
  var state = { started: false, submitted: false, stepIndex: 0, answers: {} };
  var submitting = false;

  function loadSaved() {
    try {
      var raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) return null;
      var parsed = JSON.parse(raw);
      if (parsed && parsed.answers && Object.keys(parsed.answers).length) return parsed;
    } catch (e) { /* ignore corrupt storage */ }
    return null;
  }

  function persist() {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify({ stepIndex: state.stepIndex, answers: state.answers }));
    } catch (e) { /* storage unavailable — proceed without persistence */ }
  }

  function clearSaved() {
    try { window.localStorage.removeItem(STORAGE_KEY); } catch (e) { /* ignore */ }
  }

  /* ── VISIBLE FIELDS FOR A STEP ── */
  function visibleFields(step) {
    return step.fields.filter(function (f) {
      return !f.showIf || f.showIf(state.answers);
    });
  }

  function fieldOptions(field) {
    return field.dynamicOptions ? field.dynamicOptions(state.answers) : field.options;
  }

  /* ── VALIDATION ── */
  function isEmpty(v) {
    if (v === undefined || v === null) return true;
    if (Array.isArray(v)) return v.length === 0;
    return String(v).trim() === '';
  }

  function validateStep(step) {
    var errors = {};
    visibleFields(step).forEach(function (f) {
      if (!f.required) return;
      if (isEmpty(state.answers[f.id])) errors[f.id] = 'This helps us prepare — please add an answer.';
    });
    return errors;
  }

  /* ── EVENT HANDLERS (bound via delegation each render) ── */
  function setAnswer(id, value) {
    state.answers[id] = value;
    persist();
  }

  function toggleMulti(field, value) {
    var current = state.answers[field.id] ? state.answers[field.id].slice() : [];
    var idx = current.indexOf(value);
    if (field.exclusiveValue && value === field.exclusiveValue) {
      current = idx > -1 ? [] : [value];
    } else if (idx > -1) {
      current.splice(idx, 1);
    } else {
      if (field.exclusiveValue) {
        var exIdx = current.indexOf(field.exclusiveValue);
        if (exIdx > -1) current.splice(exIdx, 1);
      }
      if (field.max && current.length >= field.max) return; // at cap
      current.push(value);
    }
    setAnswer(field.id, current);
    renderStage(true);
  }

  function selectSingle(field, value, fieldIndex, allFields) {
    setAnswer(field.id, value);
    // clear dependent answers when the driving field changes
    if (field.id === 'industry' && value !== 'Other') setAnswer('industry_other', '');
    if (field.id === 'crm' && value !== 'Other') setAnswer('crm_other', '');
    renderStage(true);
    // gentle focus-advance to the next visible field on this page (not a page change)
    window.setTimeout(function () {
      var stage = document.getElementById('qz-stage');
      if (!stage) return;
      var fieldsEls = stage.querySelectorAll('.qz-field');
      var thisEl = document.querySelector('[data-field-id="' + field.id + '"]');
      if (!thisEl) return;
      var arr = Array.prototype.slice.call(fieldsEls);
      var pos = arr.indexOf(thisEl);
      var next = arr[pos + 1];
      if (next) next.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 180);
  }

  /* ── RENDER: FIELD ── */
  function renderField(field) {
    var val = state.answers[field.id];
    var label = '<div class="qz-q-label">' + field.label + (field.required === false ? '<span class="qz-optional">Optional</span>' : '') + '</div>';
    var helper = '';
    if (field.helper) helper += '<p class="qz-helper">' + field.helper + (field.flow ? '<span class="qz-flow">' + field.flow + '</span>' : '') + '</p>';

    var body = '';
    if (field.type === 'text' || field.type === 'email') {
      body = '<input class="qz-input" type="' + (field.type === 'email' ? 'email' : 'text') + '" data-field="' + field.id + '" value="' + (val ? String(val).replace(/"/g, '&quot;') : '') + '" placeholder="' + (field.placeholder || '') + '">';
    } else if (field.type === 'textarea') {
      body = '<textarea class="qz-textarea' + (field.prominent ? ' qz-textarea-lg' : '') + '" data-field="' + field.id + '" placeholder="' + (field.placeholder || '') + '">' + (val ? String(val) : '') + '</textarea>';
    } else if (field.type === 'select') {
      var opts = fieldOptions(field) || [];
      body = '<div class="qz-options">' + opts.map(function (o) {
        var sel = val === o.value;
        return '<button type="button" class="qz-option' + (sel ? ' is-selected' : '') + '" data-select-field="' + field.id + '" data-value="' + o.value.replace(/"/g, '&quot;') + '"><span>' + o.label + '</span><span class="qz-check"></span></button>';
      }).join('') + '</div>';
    } else if (field.type === 'multiselect') {
      var mvals = val || [];
      var mopts = fieldOptions(field) || [];
      body = '<div class="qz-options">' + mopts.map(function (o) {
        var sel = mvals.indexOf(o.value) > -1;
        var atCap = field.max && mvals.length >= field.max && !sel;
        return '<button type="button" class="qz-option' + (sel ? ' is-selected' : '') + (atCap ? ' is-disabled' : '') + '" data-multi-field="' + field.id + '" data-value="' + o.value.replace(/"/g, '&quot;') + '"><span>' + o.label + '</span><span class="qz-check qz-check-sq"></span></button>';
      }).join('') + '</div>';
      if (field.max) body += '<p class="qz-multi-meta">' + mvals.length + ' of ' + field.max + ' selected</p>';
    }

    return '<div class="qz-field" data-field-id="' + field.id + '">' + label + helper + body + '<div class="qz-error-slot"></div></div>';
  }

  /* ── RENDER: START SCREEN ── */
  function renderStart(resumeData) {
    var resumeHTML = '';
    if (resumeData) {
      resumeHTML = '<div class="qz-resume"><p>You have an assessment <strong>in progress</strong>. Pick up where you left off, or start again.</p>' +
        '<div class="qz-resume-actions"><button type="button" class="btn btn-outline btn-sm" id="qz-restart">Start Over</button><button type="button" class="btn btn-orange btn-sm" id="qz-resume">Continue →</button></div></div>';
    }
    return (
      '<div class="qz-stage qz-anim">' +
      '<div class="qz-start">' +
      resumeHTML +
      '<div class="section-label orange">GTM Systems Assessment</div>' +
      '<h1>Let’s Find Where Revenue, Time and Opportunities Are Being Lost<span class="text-orange">.</span></h1>' +
      '<p class="qz-lead">Complete this short assessment before your call. It helps us understand how your business currently generates, manages and converts opportunities — so we can spend your session identifying where better systems, automation and AI could create the biggest impact.</p>' +
      '<div class="qz-timepill">Takes approximately 4–6 minutes</div><br>' +
      '<button type="button" class="btn btn-orange" id="qz-start-btn">Start Assessment →</button>' +
      '<p class="qz-start-note">Your answers help us prepare for your consultation.</p>' +
      '</div></div>'
    );
  }

  /* ── RENDER: STEP ── */
  function renderStepStage() {
    var step = STEPS[state.stepIndex];
    var fields = visibleFields(step);
    var eyebrow = step.headline ? '' : '<div class="qz-step-eyebrow">' + step.group + '</div>';
    var title = step.headline || step.title;
    var sub = step.sub ? '<p class="qz-step-sub">' + step.sub + '</p>' : '';
    var isFirst = state.stepIndex === 0;
    var isLast = state.stepIndex === TOTAL_STEPS - 1;

    return (
      '<div class="qz-stage qz-anim" id="qz-stage">' +
      eyebrow +
      '<h2 class="qz-step-title">' + title + '</h2>' +
      sub +
      fields.map(renderField).join('') +
      '<div class="qz-nav">' +
      '<button type="button" class="qz-btn-back" id="qz-back"' + (isFirst ? ' disabled' : '') + '>← Back</button>' +
      '<button type="button" class="btn btn-orange" id="qz-continue">' + (isLast ? 'Review & Submit →' : 'Continue →') + '</button>' +
      '</div></div>'
    );
  }

  /* ── RENDER: REVIEW/SUBMIT (final step's Continue leads here) ── */
  function renderSubmitStage(errorMsg) {
    return (
      '<div class="qz-stage qz-anim">' +
      '<div class="qz-step-eyebrow">Almost There</div>' +
      '<h2 class="qz-step-title">Ready to submit your assessment?</h2>' +
      '<p class="qz-step-sub">We’ll use everything you’ve told us to prepare for your session. You can still go back and adjust an answer first.</p>' +
      (errorMsg ? '<div class="qz-submit-error">' + errorMsg + '</div>' : '') +
      '<div class="qz-nav">' +
      '<button type="button" class="qz-btn-back" id="qz-back">← Back</button>' +
      '<button type="button" class="btn btn-orange" id="qz-submit">' + (submitting ? '<span class="qz-spinner"></span>Preparing your assessment…' : 'Submit Assessment →') + '</button>' +
      '</div></div>'
    );
  }

  /* ── RENDER: COMPLETION ── */
  function renderComplete() {
    return (
      '<div class="qz-complete qz-anim">' +
      '<div class="qz-complete-icon">✓</div>' +
      '<h1>Thanks — we’ve got what we need.</h1>' +
      '<p class="qz-lead">We’ll use your answers to prepare for your session so we can focus on the areas with the strongest potential impact.</p>' +
      '<a class="btn btn-orange" href="' + BOOKING_URL + '" target="_blank" rel="noopener">Book Your AI Systems Session →</a>' +
      '<div class="qz-reassure">' +
      '<div class="qz-reassure-item"><strong>Received</strong>Your assessment has been received.</div>' +
      '<div class="qz-reassure-item"><strong>Reviewed</strong>We’ll review your current systems and priorities.</div>' +
      '<div class="qz-reassure-item"><strong>Focused</strong>Your session will focus on practical opportunities.</div>' +
      '</div></div>'
    );
  }

  /* ── PROGRESS ── */
  function renderProgress() {
    var current = state.stepIndex + 1;
    var pct = Math.round((current / TOTAL_STEPS) * 100);
    return (
      '<div class="qz-topbar">' +
      '<div class="qz-progress-label"><span>Step ' + current + ' of ' + TOTAL_STEPS + ' · ' + pct + '% complete</span><a class="qz-exit" href="/">Exit</a></div>' +
      '<div class="qz-progress-track"><div class="qz-progress-fill" style="width:' + pct + '%;"></div></div></div>'
    );
  }

  /* ── MAIN RENDER DISPATCH ── */
  var mode = 'start'; // start | step | submit | complete
  var app = document.getElementById('qz-app');

  function renderStage(preserveScroll) {
    if (!app) return;
    var html = '';
    if (mode === 'start') {
      html = renderStart(loadSaved());
    } else if (mode === 'complete') {
      html = renderComplete();
    } else {
      html = renderProgress() + (mode === 'submit' ? renderSubmitStage(app.dataset.err || '') : renderStepStage());
    }
    app.innerHTML = html;
    bindEvents();
    if (!preserveScroll) window.scrollTo({ top: 0, behavior: 'auto' });
  }

  /* ── NAVIGATION ── */
  function goStep(index) {
    state.stepIndex = index;
    mode = 'step';
    persist();
    renderStage();
  }

  function goNext() {
    var step = STEPS[state.stepIndex];
    var errors = validateStep(step);
    if (Object.keys(errors).length) {
      showErrors(errors);
      return;
    }
    if (state.stepIndex >= TOTAL_STEPS - 1) {
      mode = 'submit';
      renderStage();
    } else {
      goStep(state.stepIndex + 1);
    }
  }

  function goBack() {
    if (mode === 'submit') { mode = 'step'; renderStage(); return; }
    if (state.stepIndex > 0) goStep(state.stepIndex - 1);
  }

  function showErrors(errors) {
    Object.keys(errors).forEach(function (id) {
      var el = document.querySelector('[data-field-id="' + id + '"]');
      if (!el) return;
      el.classList.add('has-error');
      var slot = el.querySelector('.qz-error-slot');
      if (slot) slot.innerHTML = '<div class="qz-error">' + errors[id] + '</div>';
    });
    var firstBad = document.querySelector('.has-error');
    if (firstBad) firstBad.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* ── SANITIZE: drop stale answers for fields hidden by later edits ── */
  function sanitizeAnswers() {
    var visibleIds = {};
    STEPS.forEach(function (step) {
      step.fields.forEach(function (f) {
        var visible = !f.showIf || f.showIf(state.answers);
        if (visible && f.dynamicOptions) {
          var validValues = f.dynamicOptions(state.answers).map(function (o) { return o.value; });
          if (state.answers[f.id] !== undefined && validValues.indexOf(state.answers[f.id]) === -1) {
            delete state.answers[f.id];
          }
        }
        if (visible) visibleIds[f.id] = true;
      });
    });
    Object.keys(state.answers).forEach(function (id) {
      if (!visibleIds[id]) delete state.answers[id];
    });
  }

  /* ── SUBMIT ── */
  function buildPayload() {
    sanitizeAnswers();
    return {
      submitted_at: new Date().toISOString(),
      source: 'questionnaire',
      answers: state.answers
    };
  }

  function submitAssessment() {
    if (submitting) return;
    submitting = true;
    app.dataset.err = '';
    renderStage(true);
    fetch(SUBMIT_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(buildPayload())
    }).then(function (res) {
      if (!res.ok) throw new Error('Submission failed');
      return res.json().catch(function () { return {}; });
    }).then(function () {
      submitting = false;
      clearSaved();
      mode = 'complete';
      renderStage();
    }).catch(function () {
      submitting = false;
      app.dataset.err = 'Sorry, something went wrong sending your assessment. Please try again.';
      renderStage(true);
    });
  }

  /* ── EVENT BINDING (delegated, re-bound on every render) ── */
  function bindEvents() {
    var startBtn = document.getElementById('qz-start-btn');
    if (startBtn) startBtn.addEventListener('click', function () {
      mode = 'step'; state.stepIndex = 0; persist(); renderStage();
    });

    var resumeBtn = document.getElementById('qz-resume');
    if (resumeBtn) resumeBtn.addEventListener('click', function () {
      var saved = loadSaved();
      if (saved) { state.answers = saved.answers || {}; state.stepIndex = saved.stepIndex || 0; }
      mode = 'step'; renderStage();
    });

    var restartBtn = document.getElementById('qz-restart');
    if (restartBtn) restartBtn.addEventListener('click', function () {
      clearSaved(); state.answers = {}; state.stepIndex = 0; mode = 'step'; renderStage();
    });

    var backBtn = document.getElementById('qz-back');
    if (backBtn) backBtn.addEventListener('click', goBack);

    var continueBtn = document.getElementById('qz-continue');
    if (continueBtn) continueBtn.addEventListener('click', goNext);

    var submitBtn = document.getElementById('qz-submit');
    if (submitBtn) submitBtn.addEventListener('click', submitAssessment);

    // text / email / textarea inputs
    Array.prototype.forEach.call(document.querySelectorAll('[data-field]'), function (el) {
      el.addEventListener('input', function () {
        var fieldEl = el.closest('.qz-field');
        if (fieldEl) { fieldEl.classList.remove('has-error'); var slot = fieldEl.querySelector('.qz-error-slot'); if (slot) slot.innerHTML = ''; }
        setAnswer(el.dataset.field, el.value);
      });
    });

    // single-select option cards
    Array.prototype.forEach.call(document.querySelectorAll('[data-select-field]'), function (btn) {
      btn.addEventListener('click', function () {
        var fieldId = btn.dataset.selectField;
        var fieldEl = btn.closest('.qz-field');
        if (fieldEl) { fieldEl.classList.remove('has-error'); var slot = fieldEl.querySelector('.qz-error-slot'); if (slot) slot.innerHTML = ''; }
        var field = null;
        STEPS.forEach(function (s) { s.fields.forEach(function (f) { if (f.id === fieldId) field = f; }); });
        if (field) selectSingle(field, btn.dataset.value);
      });
    });

    // multi-select option cards
    Array.prototype.forEach.call(document.querySelectorAll('[data-multi-field]'), function (btn) {
      btn.addEventListener('click', function () {
        var fieldId = btn.dataset.multiField;
        var fieldEl = btn.closest('.qz-field');
        if (fieldEl) { fieldEl.classList.remove('has-error'); var slot = fieldEl.querySelector('.qz-error-slot'); if (slot) slot.innerHTML = ''; }
        var field = null;
        STEPS.forEach(function (s) { s.fields.forEach(function (f) { if (f.id === fieldId) field = f; }); });
        if (field) toggleMulti(field, btn.dataset.value);
      });
    });
  }

  /* ── INIT ── */
  document.addEventListener('DOMContentLoaded', function () {
    app = document.getElementById('qz-app');
    if (!app) return;
    renderStage();
  });
})();
