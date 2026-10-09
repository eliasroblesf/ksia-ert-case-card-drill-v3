/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export interface TacticalOption {
  id: string;
  textEn: string;
  textAr: string;
  isCorrect: boolean;
  feedbackEn: string;
  feedbackAr: string;
}

export interface ProcedureSequenceStep {
  id: string;
  stepEn: string;
  stepAr: string;
  correctOrder: number; // 1-indexed order (1, 2, 3, 4, 5)
  rationaleEn: string;
  rationaleAr: string;
}

export interface Scenario {
  id: string;
  drillNumber: 1 | 2;
  roleId: string;
  roleTitleEn: string;
  roleTitleAr: string;
  titleEn: string;
  titleAr: string;
  locationEn: string;
  locationAr: string;
  contextEn: string;
  contextAr: string;
  threatEn: string;
  threatAr: string;
  occupancyEn: string;
  occupancyAr: string;
  constraintsEn: string;
  constraintsAr: string;
  procedureGuideEn: string[];
  procedureGuideAr: string[];
  correctLevel: 'Level 1' | 'Level 2' | 'Level 3';
  levelRationaleEn: string;
  levelRationaleAr: string;
  procedureSequenceSteps: ProcedureSequenceStep[];
  tacticalOptions: TacticalOption[];
}

export interface ERTRole {
  id: string;
  titleEn: string;
  titleAr: string;
  code: string;
  descriptionEn: string;
  descriptionAr: string;
  iconName: string;
  drills: Scenario[];
}

export const ERT_ROLES: ERTRole[] = [
  {
    id: 'team_leader',
    titleEn: 'Team Leader',
    titleAr: 'قائد الفريق',
    code: 'TL',
    descriptionEn: 'Directs overall on-scene command, emergency level classification, resource allocation, and agency liaison.',
    descriptionAr: 'يتولى القيادة الميدانية الشاملة، تصنيف مستوى الطوارئ، توجيه فرق الاستجابة، والتنسيق مع إدارة المطار.',
    iconName: 'ShieldAlert',
    drills: [
      {
        id: 'tl_drill_1',
        drillNumber: 1,
        roleId: 'team_leader',
        roleTitleEn: 'Team Leader',
        roleTitleAr: 'قائد الفريق',
        titleEn: 'Admin Building 2nd Floor Server Cabinet Overheat & Localized Smoke',
        titleAr: 'مبنى الإدارة - ارتفاع حرارة كابينة الخوادم بالدور الثاني وتصاعد دخان موضعي',
        locationEn: 'Airport Admin Building, 2nd Floor, Telecom Riser Room 208',
        locationAr: 'مبنى إدارة المطار، الدور الثاني، غرفة مقسم الاتصالات 208',
        contextEn: 'An uninterruptible power supply (UPS) within a secondary network cabinet overheated, emitting pungent acrid grey smoke and tripping the local optical sensor. 18 administrative personnel are working in adjacent cubicles.',
        contextAr: 'ارتفاع حراري شديد في وحدة بطاريات (UPS) داخل كابينة شبكات فرعية أدى لتصاعد دخان كيميائي رمادي وتشغيل حساس الإنذار الموضعي. يتواجد 18 موظفاً في المكاتب المجاورة.',
        threatEn: 'Incipient electrical heat buildup. Smoke is confined to Room 208 with light wisps under the door. One office assistant has slight eye irritation. No structural fire involvement.',
        threatAr: 'حرارة كهربائية في بدايتها، والدخان محصور داخل الغرفة 208 مع تسرب خفيف من أسفل الباب. موظف واحد يعاني من تحسس بالعينين. لا توجد نيران مشتعلة في هيكل المبنى.',
        occupancyEn: '18 office staff in Floor 2 West Wing. All calm but inquiring about the alarm.',
        occupancyAr: '18 موظفاً في الجناح الغربي للدور الثاني، الجميع هادئ مع الاستفسار عن سبب الإنذار.',
        constraintsEn: 'Critical IT servers must be safely bypassed if isolated. Normal fire stairs are unobstructed. Portable clean agent extinguishers are available.',
        constraintsAr: 'يجب عزل الكهرباء بأمان دون الإضرار بباقي الشبكات. سلالم الطوارئ سالكة وتتوفر طفايات غاز نظيف بالممر.',
        procedureGuideEn: [
          'Step 1: Receive discovery alert and verify exact room location and hazard parameters.',
          'Step 2: Dispatch Fire Suppression & Casualty Care officers to isolate power and assess affected personnel.',
          'Step 3: Direct adjacent office occupants to clear the immediate sector and stand by at safe boundary.',
          'Step 4: Transmit initial situation confirmation report to Airport Operations Control Center (AOCC).'
        ],
        procedureGuideAr: [
          'الخطوة 1: استلام بلاغ المكتشف والتحقق من رقم الغرفة الدقيق وطبيعة الخطر.',
          'الخطوة 2: توجيه مسؤول الإطفاء ومسؤول الإسعاف لفصل الطاقة وتقييم حالة الموظف المتأثر.',
          'الخطوة 3: توجيه موظفي المكاتب المجاورة لإخلاء النطاق المباشر والتجمع خلف خط الأمان.',
          'الخطوة 4: إرسال تقرير الموقف الأولي لمركز عمليات المطار (AOCC).'
        ],
        correctLevel: 'Level 1',
        levelRationaleEn: 'Level 1 (Localized Incident): The threat is contained within a single equipment room, involves an incipient hazard, and can be fully managed using internal trained ERT resources without external Civil Defense.',
        levelRationaleAr: 'المستوى 1 (حادث موضعي محدود): الخطر محصور داخل غرفة واحدة، في مرحلته الأولية، ويمكن إدارته بالكامل بواسطة فريق الاستجابة الداخلي دون الحاجة للدفاع المدني.',
        procedureSequenceSteps: [
          {
            id: 'tl1_s1',
            stepEn: 'Receive discovery alert and verify exact room location and hazard parameters',
            stepAr: 'استلام بلاغ المكتشف والتحقق من رقم الغرفة الدقيق وطبيعة الخطر',
            correctOrder: 1,
            rationaleEn: 'Verification of scene facts is the mandatory first step before committing response actions.',
            rationaleAr: 'التحقق من بيانات الموقع ونوع الخطر هو الخطوة الأولى الإلزامية قبل تحريك الفريق.'
          },
          {
            id: 'tl1_s2',
            stepEn: 'Dispatch Fire Suppression and Casualty Care officers to isolate power and assess personnel',
            stepAr: 'توجيه مسؤول الإطفاء ومسؤول الإسعاف لفصل الطاقة وتقييم حالة الموظفين',
            correctOrder: 2,
            rationaleEn: 'Deploying immediate internal role specialists mitigates electrical ignition and checks health hazards.',
            rationaleAr: 'تحريك مسؤولي المهام فوراً يعزل مصدر الاشتعال ويفحص سلامة الموظف المتأثر.'
          },
          {
            id: 'tl1_s3',
            stepEn: 'Direct adjacent office occupants to clear the immediate sector and stand by at safe boundary',
            stepAr: 'توجيه موظفي المكاتب المجاورة لإخلاء النطاق المباشر والتجمع خلف خط الأمان',
            correctOrder: 3,
            rationaleEn: 'Local zone clearance prevents smoke inhalation while maintaining order without campus-wide panic.',
            rationaleAr: 'إخلاء النطاق الموضعي يمنع استنشاق الدخان ويحافظ على النظام دون إثارة ذعر غير مبرر.'
          },
          {
            id: 'tl1_s4',
            stepEn: 'Transmit initial situation confirmation report to Airport Operations Control Center (AOCC)',
            stepAr: 'إرسال تقرير الموقف الأولي لمركز عمليات المطار (AOCC)',
            correctOrder: 4,
            rationaleEn: 'Closing the initial loop with AOCC ensures airport management awareness of the stabilized status.',
            rationaleAr: 'إبلاغ مركز العمليات يؤكد السيطرة الموضعية ويبقي إدارة المطار على اطلاع كامل.'
          }
        ],
        tacticalOptions: [
          {
            id: 'tl1_t1',
            textEn: 'Establish ERT forward command point at floor lobby and maintain direct radio discipline with role officers',
            textAr: 'تأسيس نقطة قيادة متقدمة في مدخل الدور والحفاظ على الانضباط اللاسلكي مع مسؤولي المهام',
            isCorrect: true,
            feedbackEn: 'Correct: Maintaining visible on-scene command ensures rapid tactical coordination.',
            feedbackAr: 'صحيح: الحفاظ على نقطة قيادة ميدانية واضحة يضمن سرعة التنسيق وتوجيه الأوامر.'
          },
          {
            id: 'tl1_t2',
            textEn: 'Order electrical maintenance to isolate Room 208 sub-panel before extinguishing operations',
            textAr: 'إصدار أمر لفني الصيانة بعزل القاطع الكهربائي للغرفة 208 قبل مباشرة الإطفاء',
            isCorrect: true,
            feedbackEn: 'Correct: Isolating electrical energy eliminates electrocution risk and continuous heat generation.',
            feedbackAr: 'صحيح: فصل التيار الكهربائي يمنع خطر الصعق واستمرار تولد الحرارة.'
          },
          {
            id: 'tl1_t3',
            textEn: 'Sound the general airport emergency sirens and order immediate mass evacuation of the entire terminal',
            textAr: 'إطلاق صفارات الإنذار العامة للمطار وإعلان إخلاء شامل لكامل صالات المطار',
            isCorrect: false,
            feedbackEn: 'Critical Error: Disproportionate response! Contained incipient level 1 events must not trigger airport-wide mass panic.',
            feedbackAr: 'خطأ جسيم: تصعيد غير مبرر! الحوادث الموضعية من المستوى 1 لا تستدعي إخلاء صالات المطار وتعطيل العمليات.'
          },
          {
            id: 'tl1_t4',
            textEn: 'Verify air quality clearance and receive all-clear from Fire Suppression before permitting re-entry',
            textAr: 'التأكد من نقاء الهواء واستلام إفادة زوال الخطر من مسؤول الإطفاء قبل السماح بالدخول',
            isCorrect: true,
            feedbackEn: 'Correct: The Team Leader must never stand down personnel until scene safety is verified.',
            feedbackAr: 'صحيح: لا يجوز لقائد الفريق إنهاء حالة التأهب إلا بعد التحقق التام من زوال الغازات والأبخرة.'
          }
        ]
      },
      {
        id: 'tl_drill_2',
        drillNumber: 2,
        roleId: 'team_leader',
        roleTitleEn: 'Team Leader',
        roleTitleAr: 'قائد الفريق',
        titleEn: 'Central Riser Cable Shaft Fire & Multi-Floor Smoke Infiltration',
        titleAr: 'مبنى الإدارة - حريق في مسار الكابلات الرأسي وتصاعد دخان كثيف متعدد الطوابق',
        locationEn: 'Airport Administration 5-Story Complex, Main Utility Riser Shaft & Stairwell B',
        locationAr: 'مجمع إدارة المطار (5 طوابق)، مسار الكابلات الرئيسي ودرج الطوارئ (ب)',
        contextEn: 'Heavy electrical feeder cables in the vertical riser ignited between Floors 1 and 2. Acrid black smoke has breached into Stairwell B, setting off floor alarms across Floors 2, 3, and 4. Over 110 employees are in the building.',
        contextAr: 'اشتعال كابلات التغذية الرئيسية داخل مسار الخدمات الرأسي بين الدورين الأول والثاني، مع تسرب دخان أسود كثيف إلى درج الطوارئ (ب) وتشغيل أجهزة الإنذار في الأدوار 2 و3 و4، مع وجود أكثر من 110 موظفين.',
        threatEn: 'Active structural duct fire with smoke migration through vertical openings. Primary Stairwell B is smoke-logged and compromised. Potential entrapment of occupants on upper floors.',
        threatAr: 'حريق نشط في مسار الكابلات مع انتشار الدخان عمودياً. درج الطوارئ (ب) امتلأ بالدخان وأصبح غير صالح للاستخدام، مع خطر محاصرة موظفين في الطوابق العليا.',
        occupancyEn: '110+ administrative staff across Floors 1-4. Multiple calls reporting smoke in corridors.',
        occupancyAr: 'أكثر من 110 موظفين في الطوابق من 1 إلى 4، مع بلاغات متزامنة عن انتشار الدخان بالممرات.',
        constraintsEn: 'Stairwell B is impassable. Elevators are grounded. Must evacuate all floors via pressurized Stairwell A. Full multi-agency response required.',
        constraintsAr: 'درج (ب) غير سالك. المصاعد تم إنزالها وإيقافها. يلزم توجيه الإخلاء بالكامل نحو درج (أ) البديل واستدعاء الدفاع المدني.',
        procedureGuideEn: [
          'Step 1: Declare Level 2 emergency and transmit urgent L-N-N-H incident report to AOCC.',
          'Step 2: Activate full ERT operational team and establish Incident Command post at safe upwind location.',
          'Step 3: Direct Liaison Officer to request immediate Civil Defense (998) response and utilities shutdown.',
          'Step 4: Order Evacuation Support to redirect all occupants to secondary pressurized Stairwell A.',
          'Step 5: Hand over tactical briefing to Civil Defense Battalion Chief upon arrival.'
        ],
        procedureGuideAr: [
          'الخطوة 1: إعلان حالة طوارئ المستوى 2 وإرسال تقرير L-N-N-H عاجل لمركز العمليات (AOCC).',
          'الخطوة 2: تفعيل كامل طاقم الاستجابة (ERT) وتأسيس مقر القيادة في موقع آمن مواجه للرياح.',
          'الخطوة 3: توجيه مسؤول التنسيق لاستدعاء الدفاع المدني (998) فوراً وطلب فصل التغذية الرئيسية.',
          'الخطوة 4: توجيه مسؤولي الإخلاء لتحويل مسار جميع الموظفين لدرج الطوارئ (أ) البديل.',
          'الخطوة 5: تسليم الموقف التكتيكي لقائد فرق الدفاع المدني فور وصولهم للموقع.'
        ],
        correctLevel: 'Level 2',
        levelRationaleEn: 'Level 2 (Facility Emergency): A multi-floor structural threat with compromised primary egress and widespread smoke requires building-wide evacuation and external Civil Defense intervention.',
        levelRationaleAr: 'المستوى 2 (طوارئ على مستوى المنشأة): حريق هيكلي يهدد طوابق متعددة مع انسداد مخرج طوارئ رئيسي وانتشار دخان، مما يتطلب إخلاء المبنى بالكامل وتدخلاً من الدفاع المدني.',
        procedureSequenceSteps: [
          {
            id: 'tl2_s1',
            stepEn: 'Declare Level 2 emergency and transmit urgent L-N-N-H incident report to AOCC',
            stepAr: 'إعلان حالة طوارئ المستوى 2 وإرسال تقرير L-N-N-H عاجل لمركز العمليات (AOCC)',
            correctOrder: 1,
            rationaleEn: 'Rapid official declaration triggers airport emergency escalation protocols immediately.',
            rationaleAr: 'الإعلان الفوري للمستوى يفعّل بروتوكولات تصعيد الطوارئ وإبلاغ الإدارات المعنية.'
          },
          {
            id: 'tl2_s2',
            stepEn: 'Activate full ERT operational team and establish Incident Command post at safe upwind location',
            stepAr: 'تفعيل كامل طاقم الاستجابة وتأسيس مقر القيادة في موقع آمن مواجه للرياح',
            correctOrder: 2,
            rationaleEn: 'Establishing command post ensures organized execution across all team disciplines.',
            rationaleAr: 'تأسيس نقطة القيادة يضمن السيطرة على تحركات الفريق وتنسيق الجهود دون ارتباك.'
          },
          {
            id: 'tl2_s3',
            stepEn: 'Direct Liaison Officer to request immediate Civil Defense (998) response and utilities shutdown',
            stepAr: 'توجيه مسؤول التنسيق لاستدعاء الدفاع المدني (998) فوراً وطلب فصل التغذية الرئيسية',
            correctOrder: 3,
            rationaleEn: 'External professional firefighting backup and main power isolation are urgent priorities.',
            rationaleAr: 'استدعاء فرق الدفاع المدني وفصل الكهرباء العامة خطوة ضرورية قبل تفاقم الحريق الهيكلي.'
          },
          {
            id: 'tl2_s4',
            stepEn: 'Order Evacuation Support to redirect all occupants to secondary pressurized Stairwell A',
            stepAr: 'توجيه مسؤولي الإخلاء لتحويل مسار جميع الموظفين لدرج الطوارئ (أ) البديل',
            correctOrder: 4,
            rationaleEn: 'Preventing occupants from entering smoke-filled Stairwell B prevents mass smoke inhalation.',
            rationaleAr: 'منع دخول الدرج الممتلئ بالدخان وتوجيه الجميع للدرج السالك ينقذ الأرواح من الاختناق.'
          },
          {
            id: 'tl2_s5',
            stepEn: 'Hand over tactical briefing to Civil Defense Battalion Chief upon arrival',
            stepAr: 'تسليم الموقف التكتيكي لقائد فرق الدفاع المدني فور وصولهم للموقع',
            correctOrder: 5,
            rationaleEn: 'A structured command handover ensures seamless integration of external heavy fire apparatus.',
            rationaleAr: 'التسليم التكتيكي المنظم ينقل السيطرة للدفاع المدني مع إحاطتهم بوضع المبنى والشاغلين.'
          }
        ],
        tacticalOptions: [
          {
            id: 'tl2_t1',
            textEn: 'Order Building Management to initiate emergency smoke extraction fans and close fire dampers',
            textAr: 'إصدار أمر لإدارة المرافق بتشغيل مراوح سحب الدخان وإغلاق خانقات الحريق بقنوات التكييف',
            isCorrect: true,
            feedbackEn: 'Correct: Smoke extraction reduces toxic atmospheric pressure in egress routes.',
            feedbackAr: 'صحيح: سحب الدخان يقلل تراكم الغازات السامة ويحافظ على مسارات النجاة.'
          },
          {
            id: 'tl2_t2',
            textEn: 'Instruct employees on the 4th floor to break exterior glass and jump onto concrete pavement',
            textAr: 'توجيه موظفي الدور الرابع بكسر الزجاج الخارجي والقفز إلى فناء المبنى الأسمنتي',
            isCorrect: false,
            feedbackEn: 'Fatal Hazard: Jumping from heights causes immediate fatalities. Trapped staff must shelter in place until ladder rescue.',
            feedbackAr: 'خطر كارثي: القفز من الطوابق العليا يسبب وفيات فورية؛ يجب الاحتماء بغرفة آمنة لحين وصول السلالم.'
          },
          {
            id: 'tl2_t3',
            textEn: 'Track assembly point roll calls and cross-reference with security badge reader logs',
            textAr: 'متابعة كشوفات حصر المتواجدين بنقاط التجمع ومطابقتها مع سجلات الدخول الإلكترونية',
            isCorrect: true,
            feedbackEn: 'Correct: Accurate accountability identifies if any trapped occupants require search and rescue.',
            feedbackAr: 'صحيح: حصر الموظفين بدقة يكشف وجود أي مفقودين يستدعون تدخل فرق الإنقاذ.'
          },
          {
            id: 'tl2_t4',
            textEn: 'Delay external emergency calls until corporate communications gives written marketing clearance',
            textAr: 'تأخير الاتصال بالجهات الخارجية حتى الحصول على موافقة خطية من إدارة الإعلام والعلاقات',
            isCorrect: false,
            feedbackEn: 'Critical Error: Delaying life safety notifications to wait for PR approval is a major safety violation.',
            feedbackAr: 'مخالفة جسيمة: تأخير إبلاغ الدفاع المدني بانتظار موافقات إدارية يعرض الأرواح للهلاك.'
          }
        ]
      }
    ]
  },
  {
    id: 'fire_suppression',
    titleEn: 'Fire Suppression',
    titleAr: 'مكافحة الحرائق',
    code: 'FS',
    descriptionEn: 'Executes rapid attack on incipient fires, verifies utility isolation, deploys portable extinguishers, and prevents fire spread.',
    descriptionAr: 'ينفذ التدخل السريع لمكافحة الحرائق في بدايتها، يتحقق من عزل الطاقة، ويستخدم الطفايات المناسبة لمنع انتشار اللهب.',
    iconName: 'Flame',
    drills: [
      {
        id: 'fs_drill_1',
        drillNumber: 1,
        roleId: 'fire_suppression',
        roleTitleEn: 'Fire Suppression',
        roleTitleAr: 'مكافحة الحرائق',
        titleEn: 'Finance Department Printing Room – Overheated Photocopier Fire',
        titleAr: 'غرفة طباعة الإدارة المالية – ماس كهربائي واشتعال آلة تصوير مستندات',
        locationEn: 'Airport Admin Building, 2nd Floor, Copy & Document Center 204',
        locationAr: 'مبنى إدارة المطار، الدور الثاني، مركز الطباعة وتصوير المستندات 204',
        contextEn: 'A high-output digital photocopier suffered an internal power board short-circuit, igniting paper feed trays and nearby document stacks. Flames are 30 cm high, producing dense white plastic smoke.',
        contextAr: 'ماس كهربائي في لوحة التغذية لآلة تصوير مستندات ضخمة أدى لاشتعال مسارات الورق والملفات المجاورة. ألسنة اللهب بارتفاع 30 سم مع دخان بلاستيكي أبيض.',
        threatEn: 'Active Class C (energized electrical) and Class A (paper) flame. The machine is still connected to a 220V wall socket. Fire is within portable extinguisher capacity.',
        threatAr: 'حريق كهربائي (صنف C) مع ورق (صنف A). الجهاز ما زال متصلاً بمصدر 220 فولت. الحريق في بدايته وضمن قدرة الطفايات اليدوية.',
        occupancyEn: 'Room evacuated. 12 finance clerks in outer open-plan office.',
        occupancyAr: 'تم إخلاء الغرفة، ويتواجد 12 موظفاً في صالة المكاتب المفتوحة المجاورة.',
        constraintsEn: 'Do not use conductive agents while energized. Hallway has 5kg CO2 and 6kg ABC dry powder extinguishers. Keep egress door clear.',
        constraintsAr: 'يمنع استخدام مواد موصلة للكهرباء. يتوفر بالممر طفاية ثاني أكسيد الكربون (CO2) وطفاية بودرة (ABC). يجب إبقاء المخرج خلفك سالكاً.',
        procedureGuideEn: [
          'Step 1: Conduct rapid scene size-up and verify that an unobstructed escape route is behind you.',
          'Step 2: Isolate the electrical power supply to the room / machine prior to chemical application.',
          'Step 3: Deploy Carbon Dioxide (CO2) extinguisher aiming at the base of the fire using the PASS method.',
          'Step 4: Inspect for hidden smoldering embers in paper stacks and close the door upon exiting.'
        ],
        procedureGuideAr: [
          'الخطوة 1: تقييم الموقف سريعاً والتأكد من وجود مسار هروب آمن وسالك خلفك تماماً.',
          'الخطوة 2: فصل مصدر التيار الكهربائي عن الآلة أو القاطع الفرعي للغرفة قبل المكافحة.',
          'الخطوة 3: استخدام طفاية ثاني أكسيد الكربون (CO2) وتوجيهها لقاعدة اللهب بأسلوب (PASS).',
          'الخطوة 4: فحص بقايا الورق للتأكد من عدم وجود جمرات كامنة وإغلاق الباب عند المغادرة.'
        ],
        correctLevel: 'Level 1',
        levelRationaleEn: 'Level 1 (Localized Incipient Incident): The fire is confined to an office machine and adjacent paper, can be extinguished with a single hand-held extinguisher, and poses no structural threat.',
        levelRationaleAr: 'المستوى 1 (حادث موضعي في بدايته): الحريق محصور في جهاز مكتبي وأوراق مجاورة، يمكن إخماده بطفاية يدوية واحدة، ولا يشكل خطراً هيكلياً.',
        procedureSequenceSteps: [
          {
            id: 'fs1_s1',
            stepEn: 'Conduct rapid scene size-up and verify that an unobstructed escape route is behind you',
            stepAr: 'تقييم الموقف سريعاً والتأكد من وجود مسار هروب آمن وسالك خلفك تماماً',
            correctOrder: 1,
            rationaleEn: 'Never enter a fire compartment without securing a clear egress path behind the firefighter.',
            rationaleAr: 'يمنع الدخول لمكافحة أي حريق قبل التأكد التام من أن طريق النجاة مفتوح خلفك.'
          },
          {
            id: 'fs1_s2',
            stepEn: 'Isolate the electrical power supply to the room or machine prior to chemical application',
            stepAr: 'فصل مصدر التيار الكهربائي عن الآلة أو القاطع الفرعي للغرفة قبل المكافحة',
            correctOrder: 2,
            rationaleEn: 'Removing electrical current converts an energized fire into a conventional Class A fire and eliminates shock hazards.',
            rationaleAr: 'فصل التيار يحول الحريق من كهربائي لصنف عادي ويزيل خطر الصعق تماماً.'
          },
          {
            id: 'fs1_s3',
            stepEn: 'Deploy Carbon Dioxide (CO2) extinguisher aiming at the base of the fire using the PASS method',
            stepAr: 'استخدام طفاية ثاني أكسيد الكربون (CO2) وتوجيهها لقاعدة اللهب بأسلوب (PASS)',
            correctOrder: 3,
            rationaleEn: 'CO2 displaces oxygen around delicate electronics without corrosive residue or electrocution risk.',
            rationaleAr: 'غاز CO2 يخنق اللهب ويحمي المكونات الإلكترونية دون ترك مخلفات كيميائية ضارة.'
          },
          {
            id: 'fs1_s4',
            stepEn: 'Inspect for hidden smoldering embers in paper stacks and close the door upon exiting',
            stepAr: 'فحص بقايا الورق للتأكد من عدم وجود جمرات كامنة وإغلاق الباب عند المغادرة',
            correctOrder: 4,
            rationaleEn: 'Ensures no reignition takes place and closes the fire compartment door to contain residual smoke.',
            rationaleAr: 'يمنع تجدد الاشتعال في الأوراق، وإغلاق الباب يحصر الدخان المتبقي داخل الغرفة.'
          }
        ],
        tacticalOptions: [
          {
            id: 'fs1_t1',
            textEn: 'Discharge the CO2 extinguisher from a distance of 1.5 to 2 meters, sweeping side-to-side at the base of flames',
            textAr: 'تفريغ طفاية CO2 من مسافة 1.5 إلى 2 متر مع تحريك الفوهة أفقياً عند قاعدة اللهب',
            isCorrect: true,
            feedbackEn: 'Correct: Sweeping the base covers the fuel surface and smothers the flame base.',
            feedbackAr: 'صحيح: توجيه الغاز لقاعدة اللهب يقطع الأكسجين عن مادة الوقود ويخمد النيران.'
          },
          {
            id: 'fs1_t2',
            textEn: 'Throw a bucket of tap water directly onto the plugged-in 220V photocopier',
            textAr: 'سكب سطل ماء مباشرة على آلة التصوير المتصلة بقابس الكهرباء 220 فولت',
            isCorrect: false,
            feedbackEn: 'Lethal Hazard: Applying water to energized electrical gear causes catastrophic electrical shock!',
            feedbackAr: 'خطر مميت: سكب الماء على جهاز كهربائي متصل يسبب صعقاً كهربائياً قاتلاً!'
          },
          {
            id: 'fs1_t3',
            textEn: 'Hold the CO2 discharge horn by the insulated handle to avoid cryogenic frostbite to the hands',
            textAr: 'الإمساك بخرطوم طفاية CO2 من المقبض العازل المخصص لتجنب عضة الصقيع الشديدة',
            isCorrect: true,
            feedbackEn: 'Correct: CO2 discharges at extremely low temperatures (-78°C); touching the horn causes severe freeze burns.',
            feedbackAr: 'صحيح: غاز CO2 يخرج بدرجة برودة فائقة (-78 مئوية) ومسك الفوهة يسبب حروق صقيع لليدين.'
          },
          {
            id: 'fs1_t4',
            textEn: 'Leave the room door propped wide open with a wedge to allow smoke to ventilate into the hallway',
            textAr: 'تثبيت باب الغرفة مفتوحاً بواسطة إسفين للسماح للدخان بالخروج إلى الممر الرئيسي',
            isCorrect: false,
            feedbackEn: 'Tactical Error: Doors must be kept closed to confine smoke and prevent corridor contamination.',
            feedbackAr: 'خطأ تكتيكي: يجب إبقاء الأبواب مغلقة لاحتواء الدخان ومنع تلوث مسارات الهروب.'
          }
        ]
      },
      {
        id: 'fs_drill_2',
        drillNumber: 2,
        roleId: 'fire_suppression',
        roleTitleEn: 'Fire Suppression',
        roleTitleAr: 'مكافحة الحرائق',
        titleEn: 'Ground Fleet Workshop – Chemical Solvent Spill & Flammable Liquid Pool Fire',
        titleAr: 'ورشة صيانة المعدات الأرضية – انسكاب مذيبات كيميائية واشتعال سائل بترولي',
        locationEn: 'Airport GSE Maintenance Facility, Bay 4 Lubricant & Solvent Storage',
        locationAr: 'مرفق صيانة معدات الخدمات الأرضية، الحظيرة 4، مستودع المذيبات والزيوت',
        contextEn: 'A 20-liter drum of industrial cleaning solvent (Flash point 38°C) was punctured by a forklift fork, spilling liquid across 8 square meters. A static spark ignited the vapors, producing rolling yellow flames and dense black hydrocarbon smoke.',
        contextAr: 'ثقب برميل مذيب تنظيف صناعي (20 لتراً) بواسطة رافعة شوكية، مما أدى لانسكاب السائل على مساحة 8 أمتار مربعة، واشتعلت الأبخرة بشرارة كهربائية مسببة لهباً متصاعداً ودخاناً أسود كثيفاً.',
        threatEn: 'Active Class B flammable liquid pool fire spreading toward nearby lube oil drums. Threat of rapid flashover and drum boiling liquid expansion.',
        threatAr: 'حريق سوائل بترولية قابلة للاشتعال (صنف B) يمتد باتجاه براميل زيوت مجاورة، مع خطر حدوث وميض شامل وانفجار البراميل بالحرارة.',
        occupancyEn: 'Maintenance technicians evacuated to apron yard. 1 technician has superficial thermal burn.',
        occupancyAr: 'تم إخلاء الفنيين إلى ساحة الطيران، وأصيب فني واحد بحرق حراري سطحي.',
        constraintsEn: 'Pressurized water streams will splash and spread burning solvent! Must use Dry Chemical Powder (ABC) or AFFF Foam. Approach upwind.',
        constraintsAr: 'استخدام خراطيم المياه العادية سيؤدي لتطاير السائل المشتعل وتوسيع رقعة الحريق! يجب استخدام البودرة الجافة أو الرغوة والتقدم مع اتجاه الرياح.',
        procedureGuideEn: [
          'Step 1: Check wind direction and approach strictly upwind with dual dry chemical extinguishers.',
          'Step 2: Verify that no water streams are applied directly to the flammable liquid pool.',
          'Step 3: Discharge dry chemical powder sweeping across the leading edge of the spill fire to suppress the vapor blanket.',
          'Step 4: Deploy spill containment sand / vermiculite dyke to prevent burning liquid entering surface drainage.',
          'Step 5: Stand by on fire-watch with foam equipment to prevent vapor re-flash until Civil Defense arrives.'
        ],
        procedureGuideAr: [
          'الخطوة 1: فحص اتجاه الرياح والتقدم من الجهة المواجهة للرياح مع طفايتي بودرة جافة.',
          'الخطوة 2: التأكد من منع توجيه أي تيارات مياه مباشرة نحو بركة السائل المشتعل.',
          'الخطوة 3: تفريغ البودرة الجافة بحركة مسح أفقية عند الحافة الأمامية للانسكاب لقطع بطانية الأبخرة.',
          'الخطوة 4: وضع حواجز رملية أو مواد ماصة لمنع تسرب السائل المشتعل إلى فتحات التصريف.',
          'الخطوة 5: البقاء في وضع المراقبة والتأهب بمعدات الرغوة لمنع اشتعال الأبخرة مجدداً حتى وصول الدفاع المدني.'
        ],
        correctLevel: 'Level 2',
        levelRationaleEn: 'Level 2 (Facility Emergency): High-hazard industrial chemical fire with flammable liquid inventory, toxic smoke, and threat to maintenance hangars requiring Civil Defense support.',
        levelRationaleAr: 'المستوى 2 (طوارئ المنشأة): حريق مواد كيميائية صناعية عالية الخطورة مع وجود سوائل قابلة للاشتعال ودخان بترولي يهدد مرافق الصيانة ويستدعي الدفاع المدني.',
        procedureSequenceSteps: [
          {
            id: 'fs2_s1',
            stepEn: 'Check wind direction and approach strictly upwind with dual dry chemical extinguishers',
            stepAr: 'فحص اتجاه الرياح والتقدم من الجهة المواجهة للرياح مع طفايتي بودرة جافة',
            correctOrder: 1,
            rationaleEn: 'Approaching upwind keeps heat and toxic vapors away from the responders.',
            rationaleAr: 'التقدم مع اتجاه الرياح يحمي المسعف من الحرارة الشديدة والأبخرة السامة المتصاعدة.'
          },
          {
            id: 'fs2_s2',
            stepEn: 'Verify that no water streams are applied directly to the flammable liquid pool',
            stepAr: 'التأكد من منع توجيه أي تيارات مياه مباشرة نحو بركة السائل المشتعل',
            correctOrder: 2,
            rationaleEn: 'Water causes liquid fuel splashing, spreading the fire and causing steam explosions.',
            rationaleAr: 'الماء يسبب تناثر الوقود السائل الساخن وتمدد رقعة اللهب بدلاً من إخمادها.'
          },
          {
            id: 'fs2_s3',
            stepEn: 'Discharge dry chemical powder sweeping across the leading edge of the spill fire to suppress the vapor blanket',
            stepAr: 'تفريغ البودرة الجافة بحركة مسح أفقية عند الحافة الأمامية للانسكاب لقطع بطانية الأبخرة',
            correctOrder: 3,
            rationaleEn: 'Dry chemical powder interrupts the chemical chain reaction of flammable vapors over the pool.',
            rationaleAr: 'البودرة الكيميائية الجافة توقف التفاعل التسلسلي لأبخرة الوقود وتعزل الأكسجين.'
          },
          {
            id: 'fs2_s4',
            stepEn: 'Deploy spill containment sand or vermiculite dyke to prevent burning liquid entering surface drainage',
            stepAr: 'وضع حواجز رملية أو مواد ماصة لمنع تسرب السائل المشتعل إلى فتحات التصريف',
            correctOrder: 4,
            rationaleEn: 'Containing runoff prevents underground sewer explosions across the airport apron.',
            rationaleAr: 'احتواء السائل يمنع وصول المواد البترولية لشبكة الصرف وحدوث انفجارات تحت الأرض.'
          },
          {
            id: 'fs2_s5',
            stepEn: 'Stand by on fire-watch with foam equipment to prevent vapor re-flash until Civil Defense arrives',
            stepAr: 'البقاء في وضع المراقبة والتأهب بمعدات الرغوة لمنع اشتعال الأبخرة مجدداً حتى وصول الدفاع المدني',
            correctOrder: 5,
            rationaleEn: 'Hot metal and residual solvent vapors can reignite violently without continuous cooling coverage.',
            rationaleAr: 'المعادن الساخنة قد تعيد إشعال الأبخرة فجأة، مما يتطلب استمرار المراقبة بالرغوة.'
          }
        ],
        tacticalOptions: [
          {
            id: 'fs2_t1',
            textEn: 'Deploy Class B-rated dry chemical extinguishers simultaneously with a coordinated side-to-side sweeping action',
            textAr: 'استخدام طفايات البودرة المخصصة للسوائل (Class B) بشكل متزامن وبحركة مسح منسقة',
            isCorrect: true,
            feedbackEn: 'Correct: Synchronized attack delivers sufficient agent concentration to smother the entire spill surface.',
            feedbackAr: 'صحيح: المكافحة المتزامنة تؤمن تركيزاً كافياً للبودرة لتغطية سطح السائل بالكامل.'
          },
          {
            id: 'fs2_t2',
            textEn: 'Spray a direct solid stream from a garden hose right into the center of the burning solvent pool',
            textAr: 'رش تيار مائي مباشر من خرطوم عادي في منتصف بركة المذيب المشتعلة',
            isCorrect: false,
            feedbackEn: 'Severe Hazard: Water sinks below solvent, boils explosively, and sprays flaming liquid over rescuers!',
            feedbackAr: 'خطر جسيم: الماء أثقل من المذيبات، يغلي فوراً وينفجر مسبباً تطاير كرات اللهب على المنقذين!'
          },
          {
            id: 'fs2_t3',
            textEn: 'Establish an exclusion perimeter and prevent any vehicles or forklifts from driving through the chemical pool',
            textAr: 'فرض طوق أمني ومنع دخول أي سيارات أو رافعات عبر بقعة المواد الكيميائية',
            isCorrect: true,
            feedbackEn: 'Correct: Vehicle exhausts and tires can provide fresh ignition sources or spread contaminated fuel.',
            feedbackAr: 'صحيح: عوادم السيارات واحتكاك الإطارات يشكلان مصدر اشتعال جديد وينشران التلوث.'
          },
          {
            id: 'fs2_t4',
            textEn: 'Never turn your back on the extinguished liquid pool; back away facing the hazard with extinguisher ready',
            textAr: 'عدم إدارة الظهر للموقع بعد الإخماد؛ التراجع للخلف مع إبقاء العين على الحريق والطفاية جاهزة',
            isCorrect: true,
            feedbackEn: 'Correct: Flammable liquid fires frequently re-flash; maintaining visual contact is vital for safety.',
            feedbackAr: 'صحيح: سوائل البترول قابلة للاشتعال المفاجئ مجدداً، ويجب التراجع مع مراقبة الموقع.'
          }
        ]
      }
    ]
  },
  {
    id: 'casualty_care',
    titleEn: 'Casualty Care',
    titleAr: 'رعاية وإسعاف المصابين',
    code: 'CC',
    descriptionEn: 'Provides emergency first aid, life-saving bleeding control, CPR/AED resuscitation, triage, and patient handover to paramedics.',
    descriptionAr: 'يقدم الإسعافات الأولية الطارئة، السيطرة على النزيف الحاد، الإنعاش القلبي والرئوي واستخدام مزيل الرجفان، وفرز المصابين.',
    iconName: 'HeartPulse',
    drills: [
      {
        id: 'cc_drill_1',
        drillNumber: 1,
        roleId: 'casualty_care',
        roleTitleEn: 'Casualty Care',
        roleTitleAr: 'رعاية وإسعاف المصابين',
        titleEn: 'Procurement Suite Renovation – Shattered Glass & Arterial Bleeding Trauma',
        titleAr: 'مكاتب المشتريات – انكسار لوح زجاجي وإصابة بنزيف شرياني حاد',
        locationEn: 'Airport Admin Building, 3rd Floor, Procurement Department Suite 315',
        locationAr: 'مبنى إدارة المطار، الدور الثالث، مكاتب المشتريات جناح 315',
        contextEn: 'During glass divider replacement, a 2.5-meter architectural tempered glass panel slipped and shattered. A procurement specialist suffered a deep forearm laceration with pulsatile bright-red spurting blood. The casualty is conscious but pale, sweating, and dizzy.',
        contextAr: 'أثناء استبدال قواطع زجاجية، انزلق لوح زجاجي ضخم وسقط متناثراً، مما أصاب أحد الموظفين بجرح عميق في الساعد مع تدفق دم شرياني نابض بغزارة. المصاب واعٍ لكنه شاحب ويتصبب عرقاً ويعاني من دوار.',
        threatEn: 'Life-threatening catastrophic arterial hemorrhage. Exsanguination shock can become irreversible within 3 minutes without immediate mechanical pressure or tourniquet.',
        threatAr: 'نزيف شرياني حاد مهدد للحياة. فقدان الدم قد يؤدي لصدمة وعائية مميتة خلال 3 دقائق دون تطبيق ضغط ميكانيكي مباشر أو استخدام العاصبة.',
        occupancyEn: 'Casualty with 8 distressed office coworkers trying to apply paper napkins.',
        occupancyAr: 'المصاب محاط بـ 8 من زملائه المذعورين يحاولون استخدام مناديل ورقية غير مجدية.',
        constraintsEn: 'Standard first aid dressings will saturate instantly. Must maintain uninterrupted pressure or apply windlass tourniquet. Call 997 immediately.',
        constraintsAr: 'الضمادات العادية ستمتلئ بالدم في ثوانٍ. يجب تطبيق ضغط مستمر دون توقف أو وضع عاصبة طبية مع استدعاء الهلال الأحمر (997).',
        procedureGuideEn: [
          'Step 1: Don sterile medical gloves and perform rapid dynamic scene safety check.',
          'Step 2: Apply immediate continuous direct mechanical pressure squarely over the wound using sterile trauma pad.',
          'Step 3: If direct pressure is insufficient to stop bright pulsatile spurting, apply tactical windlass tourniquet 5 cm proximal to wound.',
          'Step 4: Position casualty supine, elevate legs 25 cm, cover with thermal rescue blanket, and prep handover for Red Crescent.'
        ],
        procedureGuideAr: [
          'الخطوة 1: ارتداء القفازات الطبية المعقمة وإجراء فحص سريع لسلامة الموقع من الشظايا.',
          'الخطوة 2: تطبيق ضغط ميكانيكي مباشر ومستمر فوق الجرح تماماً بواسطة ضمادة طوارئ معقمة.',
          'الخطوة 3: إذا لم يتوقف النزف الشرياني المتدفق، تطبيق عاصبة طبية (Tourniquet) على مسافة 5 سم أعلى الجرح.',
          'الخطوة 4: تمديد المصاب على ظهره، رفع القدمين 25 سم، تغطيته ببطانية حرارية، وتجهيزه لتسليمه للهلال الأحمر.'
        ],
        correctLevel: 'Level 1',
        levelRationaleEn: 'Level 1 (Localized High-Acuity Medical Incident): A single severe trauma casualty requiring specialized on-scene bleeding control and priority ambulance transport (997) without facility-wide threat.',
        levelRationaleAr: 'المستوى 1 (طوارئ طبية موضعية حادة): إصابة حرجة لشخص واحد تتطلب تدخلاً إسعافياً لوقف النزيف ونقل إسعافي عاجل دون تهديد لباقي المبنى.',
        procedureSequenceSteps: [
          {
            id: 'cc1_s1',
            stepEn: 'Don sterile medical gloves and perform rapid dynamic scene safety check',
            stepAr: 'ارتداء القفازات الطبية المعقمة وإجراء فحص سريع لسلامة الموقع من الشظايا',
            correctOrder: 1,
            rationaleEn: 'Universal precautions protect both the casualty and responder from bloodborne pathogens and glass hazards.',
            rationaleAr: 'حماية المسعف والمصاب بالقفازات الطبية والتأكد من عدم وجود زجاج متناثر خطوة أولى ملزمة.'
          },
          {
            id: 'cc1_s2',
            stepEn: 'Apply immediate continuous direct mechanical pressure squarely over the wound using sterile trauma pad',
            stepAr: 'تطبيق ضغط ميكانيكي مباشر ومستمر فوق الجرح تماماً بواسطة ضمادة طوارئ معقمة',
            correctOrder: 2,
            rationaleEn: 'Direct pressure is the primary and fastest physiological mechanism to arrest life-threatening hemorrhage.',
            rationaleAr: 'الضغط المباشر المستمر هو الإجراء الفوري الأهم لوقف تدفق الدم الشرياني.'
          },
          {
            id: 'cc1_s3',
            stepEn: 'If direct pressure is insufficient to stop bright pulsatile spurting, apply tactical windlass tourniquet 5 cm proximal to wound',
            stepAr: 'إذا لم يتوقف النزف الشرياني المتدفق، تطبيق عاصبة طبية (Tourniquet) على مسافة 5 سم أعلى الجرح',
            correctOrder: 3,
            rationaleEn: 'Tourniquet occlusion of arterial inflow is the recognized life-saving intervention for unmanageable limb bleeding.',
            rationaleAr: 'استخدام العاصبة الطبية المعتمدة يوقف التروية الشريانية للأطراف وينقذ حياة المصاب من النزف المميت.'
          },
          {
            id: 'cc1_s4',
            stepEn: 'Position casualty supine, elevate legs 25 cm, cover with thermal rescue blanket, and prep handover for Red Crescent',
            stepAr: 'تمديد المصاب على ظهره، رفع القدمين 25 سم، تغطيته ببطانية حرارية، وتجهيزه لتسليمه للهلال الأحمر',
            correctOrder: 4,
            rationaleEn: 'Anti-shock positioning maintains cerebral perfusion and combats hypothermia while awaiting emergency transport.',
            rationaleAr: 'وضعية مكافحة الصدمة والتدفئة تحافظ على تروية الدماغ وتمنع انخفاض حرارة الجسم.'
          }
        ],
        tacticalOptions: [
          {
            id: 'cc1_t1',
            textEn: 'Maintain uninterrupted manual pressure over the wound; never lift the dressing to peek at the clot',
            textAr: 'الاستمرار في الضغط المباشر دون انقطاع، وعدم رفع الضمادة للنظر إلى تجلط الدم',
            isCorrect: true,
            feedbackEn: 'Correct: Lifting the dressing tears newly formed platelet clots and triggers massive re-bleeding.',
            feedbackAr: 'صحيح: رفع الضمادة يمزق خثرة الدم المتكونة حديثاً ويعيد النزيف الحاد من جديد.'
          },
          {
            id: 'cc1_t2',
            textEn: 'Repeatedly remove saturated dressings every 30 seconds and discard them in an office trash bin',
            textAr: 'نزع الضمادات الممتلئة بالدم كل 30 ثانية والتخلص منها في سلة المهملات',
            isCorrect: false,
            feedbackEn: 'Dangerous Mistake: Never remove blood-soaked dressings! Stack fresh sterile pads directly on top.',
            feedbackAr: 'خطأ إسعافي خطير: يمنع نزع الضمادات المشبعة؛ بل يجب وضع ضمادات إضافية فوقها ومواصلة الضغط.'
          },
          {
            id: 'cc1_t3',
            textEn: 'Record the exact time of tourniquet application on the casualty forehead or tourniquet time band',
            textAr: 'تسجيل وقت تركيب العاصبة الطبية بالساعة والدقيقة على جبين المصاب أو شريط العاصبة',
            isCorrect: true,
            feedbackEn: 'Correct: Documenting tourniquet application time is critical for hospital surgeons to prevent ischemic necrosis.',
            feedbackAr: 'صحيح: توثيق وقت العاصبة ضروري جداً للأطباء في المستشفى للحفاظ على الأنسجة الحيوية.'
          },
          {
            id: 'cc1_t4',
            textEn: 'Give the dizzy casualty large cups of hot coffee and aspirin tablets to drink',
            textAr: 'إعطاء المصاب الذي يشعر بالدوار أكواباً من القهوة الساخنة وأقراص أسبرين',
            isCorrect: false,
            feedbackEn: 'Critical Hazard: Aspirin is a blood thinner that accelerates hemorrhage! Never give oral fluids to shock victims.',
            feedbackAr: 'خطر مميت: الأسبرين مميع للدم ويزيد النزيف، والمنبهات والسوائل عبر الفم محظورة لمصابي الصدمة.'
          }
        ]
      },
      {
        id: 'cc_drill_2',
        drillNumber: 2,
        roleId: 'casualty_care',
        roleTitleEn: 'Casualty Care',
        roleTitleAr: 'رعاية وإسعاف المصابين',
        titleEn: 'Data Center Power Substation – Electric Arc Blast & Sudden Cardiac Arrest',
        titleAr: 'محطة كهرباء مركز البيانات – صعق كهربائي شديد وتوقف مفاجئ لعضلة القلب',
        locationEn: 'Airport Administration IT Substation Room 012, Basement Level',
        locationAr: 'محطة تغذية حاسبات إدارة المطار، غرفة 012، طابق القبو',
        contextEn: 'An electrical systems technician contacting a 380V distribution rail suffered an electric shock and arc flash. The technician collapsed backward onto rubber mats, unresponsive, motionless, and not breathing normally (agonal gasps).',
        contextAr: 'تعرض فني صيانة لصعقة كهربائية وتفريغ قوسي أثناء فحص لوحة توزيع 380 فولت، وسقط فاقداً للوعي دون حركة، مع توقف التنفس الطبيعي (شهقات احتضار متقطعة).',
        threatEn: 'Sudden cardiac arrest (ventricular fibrillation) secondary to electrical current. Biological brain death occurs within 4-6 minutes without CPR and immediate defibrillation.',
        threatAr: 'توقف مفاجئ لعضلة القلب (رجفان بطيني) ناتج عن الصعق الكهربائي. موت خلايا الدماغ يبدأ خلال 4-6 دقائق دون إنعاش قلبي ومزيل الرجفان.',
        occupancyEn: 'Victim alone with apprentice who fled to door screaming for help.',
        occupancyAr: 'المصاب بمفرده مع مساعد مذعور يصرخ طلباً للمساعدة عند الباب.',
        constraintsEn: 'Verify electrical source isolation before touching victim! Retrieve AED immediately and call 997.',
        constraintsAr: 'يجب التأكد التام من فصل مصدر الكهرباء قبل لمس المصاب! إحضار جهاز الصدمات (AED) وطلب الهلال الأحمر (997).',
        procedureGuideEn: [
          'Step 1: Verify power trip / scene electrical isolation before approaching or touching the victim.',
          'Step 2: Check responsiveness and assess for absence of normal breathing and carotid pulse within 10 seconds.',
          'Step 3: Direct assistant to call Red Crescent (997) and retrieve the nearest Automated External Defibrillator (AED).',
          'Step 4: Immediately initiate high-quality chest compressions at 100-120 bpm and 5-6 cm depth (30:2 cycle).',
          'Step 5: Apply AED electrode pads, follow voice prompts, ensure all clear, and deliver shock if advised.'
        ],
        procedureGuideAr: [
          'الخطوة 1: التحقق التام من فصل التيار الكهربائي وخلو الموقع من الخطورة قبل الاقتراب من المصاب.',
          'الخطوة 2: فحص استجابة المصاب والتحقق من غياب التنفس الطبيعي والنبض خلال 10 ثوانٍ كحد أقصى.',
          'الخطوة 3: توجيه المساعد للاتصال بالهلال الأحمر (997) وإحضار أقرب جهاز مزيل رجفان آلي (AED).',
          'الخطوة 4: البدء الفوري بضغطات الصدر عالية الجودة بمعدل 100-120 ضغطة/دقيقة وعمق 5-6 سم (دورة 30:2).',
          'الخطوة 5: تثبيت لصقات جهاز (AED)، اتباع التعليمات الصوتية، التأكد من ابتعاد الجميع، وتوجيه الصدمة إذا طُلب ذلك.'
        ],
        correctLevel: 'Level 2',
        levelRationaleEn: 'Level 2 (Facility High-Acuity Emergency): Critical industrial electrical incident with cardiac arrest requiring synchronized resuscitation team, facilities isolation, and immediate advanced life support paramedics.',
        levelRationaleAr: 'المستوى 2 (طوارئ منشأة عالية الخطورة): حادث كهربائي صناعي خطير مصحوب بتوقف قلب يستدعي تفعيل فريق الإنعاش، عزل المحطة، واستدعاء متقدم للهلال الأحمر.',
        procedureSequenceSteps: [
          {
            id: 'cc2_s1',
            stepEn: 'Verify power trip or scene electrical isolation before approaching or touching the victim',
            stepAr: 'التحقق التام من فصل التيار الكهربائي وخلو الموقع من الخطورة قبل الاقتراب من المصاب',
            correctOrder: 1,
            rationaleEn: 'Rescuer safety is paramount; touching a casualty in an energized area causes secondary electrocution.',
            rationaleAr: 'سلامة المنقذ أولاً؛ لمس مصاب لا يزال متصلاً بالتيار يسبب صعقاً مميتاً للمسعف.'
          },
          {
            id: 'cc2_s2',
            stepEn: 'Check responsiveness and assess for absence of normal breathing and carotid pulse within 10 seconds',
            stepAr: 'فحص استجابة المصاب والتحقق من غياب التنفس الطبيعي والنبض خلال 10 ثوانٍ كحد أقصى',
            correctOrder: 2,
            rationaleEn: 'Rapid assessment confirms cardiac arrest without wasting precious seconds before perfusion begins.',
            rationaleAr: 'التقييم السريع خلال ثوانٍ يؤكد توقف القلب لبدء الإنعاش دون إضاعة الوقت.'
          },
          {
            id: 'cc2_s3',
            stepEn: 'Direct assistant to call Red Crescent (997) and retrieve the nearest Automated External Defibrillator (AED)',
            stepAr: 'توجيه المساعد للاتصال بالهلال الأحمر (997) وإحضار أقرب جهاز مزيل رجفان آلي (AED)',
            correctOrder: 3,
            rationaleEn: 'Delegating emergency calls and AED retrieval ensures uninterrupted immediate rescuer compressions.',
            rationaleAr: 'تكليف المساعد بطلب الإسعاف وجلب الجهاز يتيح للمسعف التفرغ للضغطات الصدرية.'
          },
          {
            id: 'cc2_s4',
            stepEn: 'Immediately initiate high-quality chest compressions at 100-120 bpm and 5-6 cm depth (30:2 cycle)',
            stepAr: 'البدء الفوري بضغطات الصدر عالية الجودة بمعدل 100-120 ضغطة/دقيقة وعمق 5-6 سم (دورة 30:2)',
            correctOrder: 4,
            rationaleEn: 'Continuous rhythmic compressions maintain coronary and cerebral perfusion until defibrillator arrives.',
            rationaleAr: 'الضغطات الصدرية المستمرة تدفع الدم المحمل بالأكسجين للدماغ والقلب لإبقائهما على قيد الحياة.'
          },
          {
            id: 'cc2_s5',
            stepEn: 'Apply AED electrode pads, follow voice prompts, ensure all clear, and deliver shock if advised',
            stepAr: 'تثبيت لصقات جهاز (AED)، اتباع التعليمات الصوتية، التأكد من ابتعاد الجميع، وتوجيه الصدمة إذا طُلب ذلك',
            correctOrder: 5,
            rationaleEn: 'Early defibrillation within the first 3 minutes provides the highest probability of restoring sinus rhythm.',
            rationaleAr: 'إزالة الرجفان المبكرة بالصدمة الكهربائية تمنح أعلى نسبة لعودة نبض القلب الطبيعي.'
          }
        ],
        tacticalOptions: [
          {
            id: 'cc2_t1',
            textEn: 'Perform chest compressions hard and fast in the center of the chest with full recoil allowed between compressions',
            textAr: 'الضغط بقوة وسرعة في منتصف الصدر مع السماح للصدر بالارتداد الكامل بين الضغطات',
            isCorrect: true,
            feedbackEn: 'Correct: Allowing full chest recoil allows ventricular refill between compressions.',
            feedbackAr: 'صحيح: الارتداد الكامل للصدر يسمح للبطينين بالامتلاء بالدم لضخه في الضغطة التالية.'
          },
          {
            id: 'cc2_t2',
            textEn: 'Ensure nobody touches the patient and loudly command "STAND CLEAR!" before pushing the AED shock button',
            textAr: 'التأكد من عدم لمس أي شخص للمصاب والمناداة بصوت عالٍ: "ابتعدوا عن المصاب!" قبل الضغط على زر الصدمة',
            isCorrect: true,
            feedbackEn: 'Correct: Clearing the patient prevents accidental electrical shock transmission to rescuers.',
            feedbackAr: 'صحيح: إبعاد الجميع يحمي المسعفين من وصول الصدمة الكهربائية إليهم.'
          },
          {
            id: 'cc2_t3',
            textEn: 'Rush to touch and shake the victim while their hand is still resting on the live electrical conductor',
            textAr: 'الاندفاع للمس وهز المصاب ويده لا تزال ملامسة للموصل الكهربائي الحي',
            isCorrect: false,
            feedbackEn: 'Fatal Error: Severe electrocution hazard! Disconnect the power circuit breaker first.',
            feedbackAr: 'خطأ قاتل: خطر صعق مباشر! يجب فصل القاطع الكهربائي أولاً بأداة عازلة.'
          },
          {
            id: 'cc2_t4',
            textEn: 'Immediately resume CPR chest compressions starting with 30 compressions immediately after shock delivery',
            textAr: 'استئناف الضغطات الصدرية فوراً بدءاً بـ 30 ضغطة بعد توجيه الصدمة مباشرة دون تأخير',
            isCorrect: true,
            feedbackEn: 'Correct: Guidelines mandate immediate resumption of CPR after shock without pausing to check pulse.',
            feedbackAr: 'صحيح: التوصيات الطبية تؤكد استئناف الإنعاش القلبي فوراً بعد الصدمة لدعم الدورة الدموية.'
          }
        ]
      }
    ]
  },
  {
    id: 'evacuation_support',
    titleEn: 'Evacuation Support',
    titleAr: 'دعم وتوجيه الإخلاء',
    code: 'ES',
    descriptionEn: 'Directs occupants to emergency exits, conducts systematic room clearance sweeps, manages crowd flow, and assists persons with reduced mobility.',
    descriptionAr: 'يوجه شاغلي المبنى لمخارج الطوارئ، ينفذ مسحاً شاملاً للغرف للتأكد من خلوها، يدير تدفق الحشود، ويساعد ذوي الإعاقة وكبار السن.',
    iconName: 'Footprints',
    drills: [
      {
        id: 'es_drill_1',
        drillNumber: 1,
        roleId: 'evacuation_support',
        roleTitleEn: 'Evacuation Support',
        roleTitleAr: 'دعم وتوجيه الإخلاء',
        titleEn: 'East Wing 3rd Floor – Corridor Smoke Accumulation & Floor Sweep',
        titleAr: 'الجناح الشرقي بالدور الثالث – انتشار دخان بالممر ومسح إخلاء الطابق',
        locationEn: 'Airport Admin Building, 3rd Floor East Wing, Corridor & Conference Rooms',
        locationAr: 'مبنى إدارة المطار، الدور الثالث (الجناح الشرقي)، الممر وقاعات الاجتماعات',
        contextEn: 'A light haze of burning insulation smoke entered the 3rd floor East corridor from an air vent. Fire alarm strobes are flashing. Approximately 35 office employees and visitors are present, some hesitating and collecting personal belongings.',
        contextAr: 'انتشار ضباب دخاني خفيف لرائحة عوازل محترقة بممر الدور الثالث عبر فتحات التهوية، مع وميض أجهزة الإنذار. يتواجد نحو 35 موظفاً وزائراً، والبعض متردد ويحاول جمع أغراضه الشخصية.',
        threatEn: 'Potential panic and evacuation delays due to exit hesitation. Corridors are clear but smoke smell is increasing.',
        threatAr: 'احتمال حدوث ارتباك وتأخر في الإخلاء بسبب التردد والعودة للمكاتب، مع تزايد رائحة الدخان بالممر.',
        occupancyEn: '35 personnel in conference rooms, executive offices, and restrooms.',
        occupancyAr: '35 شخصاً موزعين بين قاعات الاجتماعات، المكاتب التنفيذية، ودورات المياه.',
        constraintsEn: 'Prevent use of passenger elevators. Ensure no occupants remain in soundproof meeting pods or restrooms. Assemble at Assembly Area 2.',
        constraintsAr: 'منع استخدام مصاعد الركاب نهائياً. التأكد من خلو غرف الاجتماعات العازلة للصوت ودورات المياه. التجمع في النقطة (2).',
        procedureGuideEn: [
          'Step 1: Don high-visibility ERT vest, activate flashlight, and announce evacuation in a firm authoritative voice.',
          'Step 2: Intercept occupants heading toward elevators and guide them strictly into designated Fire Exit Stairwell A.',
          'Step 3: Conduct systematic sweep of all offices, conference pods, and restrooms, closing doors behind.',
          'Step 4: Escort the final evacuees outside, report floor all-clear to Team Leader at Assembly Point 2, and monitor headcount.'
        ],
        procedureGuideAr: [
          'الخطوة 1: ارتداء سترة الطوارئ الفسفورية، تجهيز الكشاف، وإعلان الإخلاء بصوت واثق ومسموع.',
          'الخطوة 2: اعتراض الموظفين المتجهين للمصاعد وتوجيههم بحزم نحو درج الطوارئ المعتمد (أ).',
          'الخطوة 3: تنفيذ مسح منظم لكافة المكاتب وقاعات الاجتماعات ودورات المياه وإغلاق الأبواب بعد التأكد.',
          'الخطوة 4: مرافقة آخر الخارجين، وتقديم إفادة خلو الطابق لقائد الفريق في نقطة التجمع (2) ومتابعة الحصر.'
        ],
        correctLevel: 'Level 1',
        levelRationaleEn: 'Level 1 (Localized Sector Evacuation): Single-wing precautionary evacuation managed smoothly by floor evacuation wardens with unobstructed primary exits and no active flames in corridor.',
        levelRationaleAr: 'المستوى 1 (إخلاء قطاع موضعي): إخلاء احترازي لجناح واحد ينفذه مسؤولو الإخلاء بمسارات طوارئ سالكة ودون وجود نيران مباشرة في الممرات.',
        procedureSequenceSteps: [
          {
            id: 'es1_s1',
            stepEn: 'Don high-visibility ERT vest, activate flashlight, and announce evacuation in a firm authoritative voice',
            stepAr: 'ارتداء سترة الطوارئ الفسفورية، تجهيز الكشاف، وإعلان الإخلاء بصوت واثق ومسموع',
            correctOrder: 1,
            rationaleEn: 'Clear warden identification and calm verbal leadership immediately overcome occupant indecision and hesitation.',
            rationaleAr: 'ارتداء السترة وإعلان الأوامر بوضوح يمنح الموظفين توجيهاً فورياً ويزيل الحيرة والتردد.'
          },
          {
            id: 'es1_s2',
            stepEn: 'Intercept occupants heading toward elevators and guide them strictly into designated Fire Exit Stairwell A',
            stepAr: 'اعتراض الموظفين المتجهين للمصاعد وتوجيههم بحزم نحو درج الطوارئ المعتمد (أ)',
            correctOrder: 2,
            rationaleEn: 'Preventing elevator usage is a critical life-safety priority to avoid occupants being trapped in power failures.',
            rationaleAr: 'منع استخدام المصاعد خطوة حاسمة لمنع احتجاز الأشخاص داخل الكبائن عند انقطاع الكهرباء.'
          },
          {
            id: 'es1_s3',
            stepEn: 'Conduct systematic sweep of all offices, conference pods, and restrooms, closing doors behind',
            stepAr: 'تنفيذ مسح منظم لكافة المكاتب وقاعات الاجتماعات ودورات المياه وإغلاق الأبواب بعد التأكد',
            correctOrder: 3,
            rationaleEn: 'Sweeping ensures nobody is left behind, and closing doors creates fire and smoke barriers.',
            rationaleAr: 'المسح يضمن عدم بقاء أي شخص، وإغلاق الأبواب يحد من انتشار الدخان بين الغرف.'
          },
          {
            id: 'es1_s4',
            stepEn: 'Escort the final evacuees outside, report floor all-clear to Team Leader at Assembly Point 2, and monitor headcount',
            stepAr: 'مرافقة آخر الخارجين، وتقديم إفادة خلو الطابق لقائد الفريق في نقطة التجمع (2) ومتابعة الحصر',
            correctOrder: 4,
            rationaleEn: 'Closing the evacuation loop with the Team Leader ensures complete accountability at the assembly point.',
            rationaleAr: 'إبلاغ قائد الفريق بخلو الدور يحقق الحصر الدقيق ويتيح الانتقال للمراحل التالية.'
          }
        ],
        tacticalOptions: [
          {
            id: 'es1_t1',
            textEn: 'Physically position yourself at the elevator lobby to divert traffic away from lift doors toward exit stairs',
            textAr: 'التمركز الميداني عند بهو المصاعد لتحويل مسار الموظفين بعيداً عن المصاعد نحو درج الطوارئ',
            isCorrect: true,
            feedbackEn: 'Correct: Physical presence prevents habitual elevator use during emergency alarms.',
            feedbackAr: 'صحيح: التواجد الميداني أمام المصاعد يمنع استخدامها تلقائياً ويوجه الحشود للدرج الآمن.'
          },
          {
            id: 'es1_t2',
            textEn: 'Permit employees to turn around and run back into offices to retrieve heavy laptops and winter jackets',
            textAr: 'السماح للموظفين بالعودة للمكاتب لجمع الحواسيب المحمولة والحقائب والسترات',
            isCorrect: false,
            feedbackEn: 'Dangerous Violation: Evacuees must never re-enter buildings for personal belongings.',
            feedbackAr: 'مخالفة خطيرة: يمنع منعاً باتاً السماح للموظفين بالعودة للمبنى لجلب مقتنيات شخصية.'
          },
          {
            id: 'es1_t3',
            textEn: 'Knock loudly on restroom doors and announce: "Emergency evacuation! Vacate the building immediately!"',
            textAr: 'طرق أبواب دورات المياه والمناداة بصوت عالٍ: "إخلاء طوارئ! غادروا المبنى فوراً!"',
            isCorrect: true,
            feedbackEn: 'Correct: Restrooms and soundproof spaces are common trap locations where alarms may be muffled.',
            feedbackAr: 'صحيح: دورات المياه والقاعات المعزولة أماكن متكررة لوجود أشخاص لم ينتبهوا للإنذار.'
          },
          {
            id: 'es1_t4',
            textEn: 'Instruct the crowd to run down the stairwells as fast as possible pushing ahead of slower walkers',
            textAr: 'توجيه الموظفين بالركض بأقصى سرعة في السلالم والتدافع لتجاوز كبار السن',
            isCorrect: false,
            feedbackEn: 'Severe Hazard: Running and pushing causes stampedes, falls, and crushing trauma on stairs.',
            feedbackAr: 'خطر جسيم: الركض والتدافع على السلالم يسبب التعثر وحوادث دهس وإصابات بليغة.'
          }
        ]
      },
      {
        id: 'es_drill_2',
        drillNumber: 2,
        roleId: 'evacuation_support',
        roleTitleEn: 'Evacuation Support',
        roleTitleAr: 'دعم وتوجيه الإخلاء',
        titleEn: 'South Wing Stairwell B Smoke Ingress & Wheelchair Evacuation Assist',
        titleAr: 'الجناح الجنوبي – تسرب دخان لدرج (ب) ومساعدة إخلاء موظف على كرسي متحرك',
        locationEn: 'Airport Admin Complex, 4th Floor South Wing, Stairwell B Landing & Refuge Area',
        locationAr: 'مجمع إدارة المطار، الدور الرابع (الجناح الجنوبي)، مهبط درج (ب) ومنطقة الملاذ الآمن',
        contextEn: 'Dense black smoke entered Stairwell B from an unlatched fire door on Floor 2, rendering Stairwell B impassable. 45 occupants on Floor 4 are encountering smoke at the door and stopping in fear. Among them is an employee using a manual wheelchair and a colleague who stayed to assist.',
        contextAr: 'دخان أسود كثيف تسرب لدرج الطوارئ (ب) عبر باب لم يغلق بالدور الثاني، مما جعل الدرج غير صالح للاستخدام. 45 موظفاً بالدور الرابع فوجئوا بالدخان وتوقفوا بذعر، ومن بينهم موظف على كرسي متحرك وزميله.',
        threatEn: 'Exit blockage, crowd compression panic, and mobility-impaired occupant stranded on an upper floor with active smoke progression.',
        threatAr: 'انسداد مخرج طوارئ، خطر تدافع الحشود وتراكمها، واحتجاز موظف من ذوي الإعاقة الحركية بطابق مرتفع.',
        occupancyEn: '45 employees on Floor 4, including 1 wheelchair occupant and 1 pregnant staff member.',
        occupancyAr: '45 موظفاً في الدور الرابع، بينهم موظف على كرسي متحرك وموظفة حامل.',
        constraintsEn: 'Stairwell B is blocked. Stairwell A is pressurized and 60 meters down the north corridor. Must use the certified evacuation chair.',
        constraintsAr: 'درج (ب) مغلق بالدخان. درج (أ) مضغوط وسالك على بعد 60 متراً شمالاً. يجب استخدام كرسي الإخلاء المخصص (Evac-Chair).',
        procedureGuideEn: [
          'Step 1: Intercept crowd at Stairwell B, close the fire door immediately, and direct occupants toward clear Stairwell A.',
          'Step 2: Transfer wheelchair occupant to the floor certified Evacuation Chair located in the safety niche.',
          'Step 3: Assign a two-warden team to operate the evacuation chair and escort the pregnant colleague down Stairwell A.',
          'Step 4: Maintain orderly single-file flow along the right-hand handrail of Stairwell A.',
          'Step 5: Hand over the mobility-assisted evacuee at ground level to Casualty Care and confirm complete wing clearance.'
        ],
        procedureGuideAr: [
          'الخطوة 1: اعتراض الحشد عند درج (ب)، إغلاق باب الحريق فوراً، وتوجيه الجميع نحو درج (أ) البديل السالك.',
          'الخطوة 2: نقل الموظف مستخدم الكرسي المتحرك إلى كرسي الإخلاء المخصص (Evac-Chair) المعلق بالجدار.',
          'الخطوة 3: تكليف مسؤولي إخلاء اثنين بتشغيل كرسي الإخلاء ومرافقة الموظفة الحامل عبر درج (أ).',
          'الخطوة 4: الحفاظ على تدفق الحشود بانتظام في طابور فردي بمحاذاة الدرابزين الأيمن لدرج (أ).',
          'الخطوة 5: تسليم الموظف ذي الإعاقة عند المخرج الأرضي لمسؤول الإسعاف وتأكيد إخلاء الجناح بالكامل.'
        ],
        correctLevel: 'Level 2',
        levelRationaleEn: 'Level 2 (Facility Emergency): Compromised primary egress route with heavy smoke and assisted evacuation of mobility-impaired staff requiring multi-zone redirect and specialized equipment.',
        levelRationaleAr: 'المستوى 2 (طوارئ المنشأة): انسداد مخرج رئيسي بالدخان وتطلب إخلاء بمساعدة خاصة لذوي الإعاقة الحركية مع تحويل مسار التدفق بالكامل لدرج بديل.',
        procedureSequenceSteps: [
          {
            id: 'es2_s1',
            stepEn: 'Intercept crowd at Stairwell B, close the fire door immediately, and direct occupants toward clear Stairwell A',
            stepAr: 'اعتراض الحشد عند درج (ب)، إغلاق باب الحريق فوراً، وتوجيه الجميع نحو درج (أ) البديل السالك',
            correctOrder: 1,
            rationaleEn: 'Halting occupants before they inhale smoke and closing the door preserves life safety and stops smoke spread.',
            rationaleAr: 'منع دخول الدرج الممتلئ بالدخان وإغلاق الباب يمنع حالات الاختناق ويحمي الدور.'
          },
          {
            id: 'es2_s2',
            stepEn: 'Transfer wheelchair occupant to the floor certified Evacuation Chair located in the safety niche',
            stepAr: 'نقل الموظف مستخدم الكرسي المتحرك إلى كرسي الإخلاء المخصص (Evac-Chair) المعلق بالجدار',
            correctOrder: 2,
            rationaleEn: 'Standard wheelchairs cannot safely descend fire stairs; specialized tracked chairs are designed for stair evacuation.',
            rationaleAr: 'الكراسي المتحركة العادية لا تصلح لنزول الدرج، وكرسي الإخلاء المزود بمكابح انزلاق هو المعتمد للأمان.'
          },
          {
            id: 'es2_s3',
            stepEn: 'Assign a two-warden team to operate the evacuation chair and escort the pregnant colleague down Stairwell A',
            stepAr: 'تكليف مسؤولي إخلاء اثنين بتشغيل كرسي الإخلاء ومرافقة الموظفة الحامل عبر درج (أ)',
            correctOrder: 3,
            rationaleEn: 'Dedicated staffing ensures controlled descent without blocking the general flow of evacuating colleagues.',
            rationaleAr: 'تخصيص مسعفين لكرسي الإخلاء يضمن النزول الآمن دون عرقلة باقي الموظفين على الدرج.'
          },
          {
            id: 'es2_s4',
            stepEn: 'Maintain orderly single-file flow along the right-hand handrail of Stairwell A',
            stepAr: 'الحفاظ على تدفق الحشود بانتظام في طابور فردي بمحاذاة الدرابزين الأيمن لدرج (أ)',
            correctOrder: 4,
            rationaleEn: 'Single-file right-side descent leaves the left side clear for ascending Civil Defense firefighters with hoses.',
            rationaleAr: 'النزول بجهة اليمين يترك الجانب الأيسر سالكاً لصعود رجال الدفاع المدني ومعداتهم.'
          },
          {
            id: 'es2_s5',
            stepEn: 'Hand over the mobility-assisted evacuee at ground level to Casualty Care and confirm complete wing clearance',
            stepAr: 'تسليم الموظف ذي الإعاقة عند المخرج الأرضي لمسؤول الإسعاف وتأكيد إخلاء الجناح بالكامل',
            correctOrder: 5,
            rationaleEn: 'Direct handover ensures medical check for the assisted individual and confirms safe completion of evacuation.',
            rationaleAr: 'التسليم المباشر لمسؤول الإسعاف يؤكد سلامة المصابين ويوثق اكتمال خروج الجميع.'
          }
        ],
        tacticalOptions: [
          {
            id: 'es2_t1',
            textEn: 'Unfold and lock the friction tracks on the evacuation chair before guiding it down the stair treads',
            textAr: 'فتح وتثبيت زلاجات الاحتكاك في كرسي الإخلاء قبل النزول به على حواف درجات السلم',
            isCorrect: true,
            feedbackEn: 'Correct: The friction tracks provide controlled mechanical braking on the stairs.',
            feedbackAr: 'صحيح: زلاجات الاحتكاك توفر فرملة ميكانيكية ذاتية تضمن انزلاقاً سلساً وآمناً على الدرج.'
          },
          {
            id: 'es2_t2',
            textEn: 'Abandon the wheelchair employee in the smoky corridor and tell them to wait for the fire department alone',
            textAr: 'ترك الموظف ذي الإعاقة في الممر الممتلئ بالدخان وإبلاغه بالانتظار بمفرده',
            isCorrect: false,
            feedbackEn: 'Gross Negligence: ERT members must never abandon vulnerable occupants in an active hazard zone.',
            feedbackAr: 'إهمال جسيم لا يُغتفر: يحظر التخلي عن أي شخص من ذوي الإعاقة داخل منطقة خطر نشطة.'
          },
          {
            id: 'es2_t3',
            textEn: 'Attempt to force the standard heavy manual wheelchair into passenger elevator car during the building fire alarm',
            textAr: 'محاولة إدخال الكرسي المتحرك العادي داخل مصعد الركاب أثناء عمل إنذار الحريق',
            isCorrect: false,
            feedbackEn: 'Fatal Hazard: Elevators can malfunction, open on the fire floor, or become smoke-filled death traps.',
            feedbackAr: 'خطر مميت: المصاعد قد تتوقف فجأة وتتحول إلى غرف اختناق بالدخان أو تفتح في طابق الحريق.'
          },
          {
            id: 'es2_t4',
            textEn: 'Keep voice modulation calm and reassuring to alleviate anxiety for both the assisted evacuee and the crowd',
            textAr: 'التحدث بنبرة هادئة ومطمئنة لتهدئة روع الموظف ذي الإعاقة ومنع انتشار الذعر بين الحشود',
            isCorrect: true,
            feedbackEn: 'Correct: Calm psychological management prevents panic and panic-induced movement errors.',
            feedbackAr: 'صحيح: التهدئة النفسية تمنع التوتر والتدافع وتسهل النزول السلس والآمن.'
          }
        ]
      }
    ]
  },
  {
    id: 'liaison',
    titleEn: 'Liaison & External Agency Interface',
    titleAr: 'التنسيق والاتصال بالجهات الخارجية',
    code: 'LI',
    descriptionEn: 'Coordinates communications between ERT, Airport Operations Control Center (AOCC), Saudi Red Crescent, Civil Defense, and Airport Security.',
    descriptionAr: 'ينسق الاتصالات المباشرة بين فريق الاستجابة، مركز عمليات المطار (AOCC)، الهلال الأحمر السعودي، الدفاع المدني، وأمن المطار.',
    iconName: 'Radio',
    drills: [
      {
        id: 'li_drill_1',
        drillNumber: 1,
        roleId: 'liaison',
        roleTitleEn: 'Liaison & External Agency Interface',
        roleTitleAr: 'التنسيق والاتصال بالجهات الخارجية',
        titleEn: 'Medical Trauma Incident – External Ambulance Dispatch & Security Gate Interface',
        titleAr: 'حالة طبية طارئة – استدعاء إسعاف خارجي والتنسيق مع بوابات أمن المطار',
        locationEn: 'Airport Admin Building, Ground Floor Security Gate 4 & Main Entrance Bay',
        locationAr: 'مبنى إدارة المطار، الدور الأرضي، بوابة الأمن رقم 4 وموقف الطوارئ الرئيسي',
        contextEn: 'Casualty Care officer reports a severe bleeding trauma requiring immediate hospital transport. The ERT Team Leader has requested dispatch of the Saudi Red Crescent (997) ambulance and priority clearance through secured airport perimeter checkpoints.',
        contextAr: 'أفاد مسؤول الإسعاف بوجود إصابة نزيف حاد تستدعي نقلاً فورياً للمستشفى. طلب قائد الفريق استدعاء سيارة إسعاف الهلال الأحمر (997) وتأمين دخولها السريع عبر بوابات المطار الأمنية.',
        threatEn: 'Airport security barriers and perimeter gates can cause lethal 10-15 minute delays for external emergency vehicles if not pre-cleared and guided.',
        threatAr: 'بوابات أمن المطار ونقاط التفتيش قد تؤخر سيارة الإسعاف الخارجية لـ 10-15 دقيقة إن لم يتم التنسيق المسبق وفتح الحواجز ومرافقتها.',
        occupancyEn: 'Casualty being stabilized by Casualty Care. Airport Security shifts active at Gate 4.',
        occupancyAr: 'المصاب يتلقى الإسعاف الأولي، وأفراد أمن المطار متواجدون عند البوابة 4.',
        constraintsEn: 'External paramedics unfamiliar with airport internal roads. Must provide accurate L-N-N-H details and dispatch escort guide.',
        constraintsAr: 'طاقم الهلال الأحمر قد لا يعرف المسار الداخلي للمبنى؛ يجب تزويدهم ببيانات دقيقة (L-N-N-H) وإرسال مرشد لاستقبالهم.',
        procedureGuideEn: [
          'Step 1: Contact Saudi Red Crescent Operations (997) and transmit standardized L-N-N-H report (Location, Nature, Number, Hazards).',
          'Step 2: Log emergency dispatch reference number and notify Airport Operations Control Center (AOCC) duty manager.',
          'Step 3: Interface with Airport Security Operations to override electronic barriers and pre-clear Gate 4 access.',
          'Step 4: Dispatch an ERT guide equipped with amber flashing baton to Gate 4 to meet and lead the ambulance directly to Entrance Bay.'
        ],
        procedureGuideAr: [
          'الخطوة 1: الاتصال بعمليات الهلال الأحمر (997) وإرسال بلاغ منظم بنموذج (L-N-N-H) يوضح الموقع، نوع الحادث، عدد المصابين، والمخاطر.',
          'الخطوة 2: تدوين رقم بلاغ الإسعاف وإشعار مدير نوبة مركز عمليات المطار (AOCC).',
          'الخطوة 3: التنسيق مع عمليات أمن المطار لفتح الحواجز الإلكترونية وتسهيل دخول الإسعاف عبر البوابة 4 فوراً.',
          'الخطوة 4: إرسال مرشد من الفريق مزود بعصا ضوئية للبوابة 4 لاستقبال سيارة الإسعاف ومرافقتها لمدخل المبنى.'
        ],
        correctLevel: 'Level 1',
        levelRationaleEn: 'Level 1 (Localized Incident with External Support): Medical emergency confined to a single individual, requiring external ambulance transport and gate coordination without terminal disruption.',
        levelRationaleAr: 'المستوى 1 (حادث موضعي مع دعم خارجي): طوارئ طبية محصورة في فرد واحد تتطلب نقلاً إسعافياً وتنسيقاً أمنياً للبوابات دون تعطيل عمليات المطار.',
        procedureSequenceSteps: [
          {
            id: 'li1_s1',
            stepEn: 'Contact Saudi Red Crescent Operations (997) and transmit standardized L-N-N-H report',
            stepAr: 'الاتصال بعمليات الهلال الأحمر (997) وإرسال بلاغ منظم بنموذج (L-N-N-H)',
            correctOrder: 1,
            rationaleEn: 'Immediate 997 dispatch starts the ambulance travel clock without administrative friction.',
            rationaleAr: 'الاتصال الفوري بالهلال الأحمر يختصر وقت الاستجابة ويحرك سيارة الإسعاف دون إبطاء.'
          },
          {
            id: 'li1_s2',
            stepEn: 'Log emergency dispatch reference number and notify Airport Operations Control Center (AOCC) duty manager',
            stepAr: 'تدوين رقم بلاغ الإسعاف وإشعار مدير نوبة مركز عمليات المطار (AOCC)',
            correctOrder: 2,
            rationaleEn: 'Official logging keeps airport operational leadership updated on authorized external vehicle dispatch.',
            rationaleAr: 'توثيق البلاغ وإشعار عمليات المطار يضمن التوافق المؤسسي ومتابعة الموقف.'
          },
          {
            id: 'li1_s3',
            stepEn: 'Interface with Airport Security Operations to override electronic barriers and pre-clear Gate 4 access',
            stepAr: 'التنسيق مع عمليات أمن المطار لفتح الحواجز الإلكترونية وتسهيل دخول الإسعاف عبر البوابة 4 فوراً',
            correctOrder: 3,
            rationaleEn: 'Pre-clearing security gates avoids vehicle hold-ups and perimeter search delays.',
            rationaleAr: 'التنسيق الأمني المسبق يفتح الحواجز ويلغي التوقف في نقاط التفتيش.'
          },
          {
            id: 'li1_s4',
            stepEn: 'Dispatch an ERT guide equipped with amber flashing baton to Gate 4 to meet and lead the ambulance directly to Entrance Bay',
            stepAr: 'إرسال مرشد من الفريق مزود بعصا ضوئية للبوابة 4 لاستقبال سيارة الإسعاف ومرافقتها لمدخل المبنى',
            correctOrder: 4,
            rationaleEn: 'An escort guide prevents external drivers from getting lost on complex airport access roads.',
            rationaleAr: 'إرسال مرشد يوجه طاقم الإسعاف بالمسار الأقصر ويمنع ضياعهم في طرق المطار.'
          }
        ],
        tacticalOptions: [
          {
            id: 'li1_t1',
            textEn: 'Provide 997 dispatcher with specific landmark instructions: "KSIA Admin Complex, Security Gate 4 on West Perimeter Road"',
            textAr: 'تزويد مأمور 997 بتفاصيل دقيقة: "مجمع إدارة مطار الملك خالد، بوابة الأمن 4 على طريق المحيط الغربي"',
            isCorrect: true,
            feedbackEn: 'Correct: Clear geographic precision eliminates ambulance navigation errors.',
            feedbackAr: 'صحيح: الدقة الجغرافية وتحديد المعالم يمنع أي ارتباك في توجيه سيارات الإسعاف.'
          },
          {
            id: 'li1_t2',
            textEn: 'Tell the 997 operator: "There is someone bleeding somewhere at the airport, find us when you get here" and hang up',
            textAr: 'إبلاغ مأمور 997: "يوجد شخص ينزف في مكان ما بالمطار، ابحثوا عنا عند وصولكم" ثم إغلاق الهاتف',
            isCorrect: false,
            feedbackEn: 'Dangerous Violation: Vague emergency reports lead to catastrophic delays and misrouted units.',
            feedbackAr: 'مخالفة بالغة الخطورة: البلاغات المبهمة تضلل فرق الطوارئ وتؤخر وصول المساعدة الحيوية.'
          },
          {
            id: 'li1_t3',
            textEn: 'Verify that an ERT member maintains visual contact at the gate with two-way radio linked to Liaison channel',
            textAr: 'التأكد من تواجد عضو من الفريق عند البوابة متصلاً لاسلكياً مع مسؤول التنسيق',
            isCorrect: true,
            feedbackEn: 'Correct: Real-time radio link confirms ambulance arrival and prepares casualty transfer without delay.',
            feedbackAr: 'صحيح: الاتصال اللاسلكي المباشر يؤكد وصول الإسعاف ويجهز المصاب للنقل الفوري.'
          },
          {
            id: 'li1_t4',
            textEn: 'Post photographs of the bleeding casualty and security gate access codes on social media channels',
            textAr: 'نشر صور للمصاب والنزيف مع رموز المرور الأمنية على وسائل التواصل الاجتماعي',
            isCorrect: false,
            feedbackEn: 'Severe Breach: Violates victim confidentiality, airport security protocols, and operational safety laws.',
            feedbackAr: 'مخالفة أمنية وقانونية جسيمة: نشر الصور يخترق خصوصية المصاب ويهدد أمن المطار.'
          }
        ]
      },
      {
        id: 'li_drill_2',
        drillNumber: 2,
        roleId: 'liaison',
        roleTitleEn: 'Liaison & External Agency Interface',
        roleTitleAr: 'التنسيق والاتصال بالجهات الخارجية',
        titleEn: 'Multi-Agency Level 3 Incident – Civil Defense Briefing & Perimeter Command',
        titleAr: 'طوارئ كبرى المستوى 3 – تسليم الموقف التكتيكي للدفاع المدني وإدارة الطوق الأمني',
        locationEn: 'Airport Administration Complex Outer Staging Plaza & Incident Command Vehicle',
        locationAr: 'ساحة التجمع الرئيسية لمجمع إدارة المطار وموقع مركبة القيادة الميدانية',
        contextEn: 'A major structural fire has spread across two floors of the Administration Complex with smoke trapping occupants. Civil Defense (998) strike companies and Red Crescent mass casualty units have arrived at the airport perimeter gate. The incident has been classified Level 3.',
        contextAr: 'حريق هيكلي كبير امتد عبر طابقين في مجمع الإدارة مع محاصرة الدخان لبعض الموظفين. وصلت آليات الدفاع المدني (998) وسيارات الهلال الأحمر لبوابة المطار، وتم تصنيف الحادث في المستوى 3.',
        threatEn: 'Extreme structural fire, toxic atmosphere, multiple casualties, and potential operational paralysis of adjacent flight support offices.',
        threatAr: 'حريق هيكلي شديد، غازات سامة، مصابون متعددون، وخطر تعطل المكاتب الداعمة لعمليات الطيران بالمطار.',
        occupancyEn: 'Multiple floors evacuating, over 140 staff outside at assembly zones, 3 reported unaccounted for.',
        occupancyAr: 'إخلاء طوابق متعددة، أكثر من 140 موظفاً بنقاط التجمع، مع الإبلاغ عن 3 مفقودين.',
        constraintsEn: 'Civil Defense requires building blueprints, hazardous materials storage locations, and utility isolation status immediately. Hydrant lines must be unobstructed.',
        constraintsAr: 'الدفاع المدني يطلب فوراً مخططات المبنى، مواقع تخزين المواد الخطرة، وتقرير عزل الكهرباء. يجب إخلاء مسارات حنفيات الحريق.',
        procedureGuideEn: [
          'Step 1: Meet the Civil Defense Battalion Commander at the Forward Incident Staging Area with the Emergency Briefing Packet.',
          'Step 2: Deliver structured tactical verbal handover (fire sector, missing occupants, utilities cutoff status, known hazards).',
          'Step 3: Coordinate with Airport Police to secure perimeter cordon, clear apparatus lanes, and unblock fire hydrants.',
          'Step 4: Establish joint radio liaison link between ERT Command and Civil Defense Incident Command Vehicle.',
          'Step 5: Maintain synchronized agency incident log documenting arrival times, deployed companies, and casualty transports.'
        ],
        procedureGuideAr: [
          'الخطوة 1: استقبال قائد فرق الدفاع المدني في منطقة التجمع الميداني ومعه حقيبة المخططات وبيانات الطوارئ.',
          'الخطوة 2: تقديم إيجاز تكتيكي منظم (موقع الحريق، المفقودون، حالة فصل الكهرباء، والمخاطر الكيميائية).',
          'الخطوة 3: التنسيق مع شرطة المطار لفرض طوق أمني، تأمين مسارات الآليات الثقيلة، وخلو محابس الحريق.',
          'الخطوة 4: تثبيت قناة اتصال لاسلكي مشتركة بين قيادة الفريق الداخلي ومركبة قيادة الدفاع المدني.',
          'الخطوة 5: إدارة سجل التنسيق الموحد لتوثيق أوقات وصول الفرق، الوحدات المشاركة، وحالات المصابين المنقولين.'
        ],
        correctLevel: 'Level 3',
        levelRationaleEn: 'Level 3 (Major Aerodrome Disaster / Complex Multi-Agency Crisis): Multi-floor structural fire with trapped occupants requiring external municipal Civil Defense command, mass casualty management, and total airport operational interface.',
        levelRationaleAr: 'المستوى 3 (حادث طوارئ كبير على مستوى المنشأة): حريق هيكلي واسع ومحاصرون يتطلب قيادة كاملة للدفاع المدني، تعامل مع إصابات متعددة، وتنسيقاً شاملاً على مستوى المطار.',
        procedureSequenceSteps: [
          {
            id: 'li2_s1',
            stepEn: 'Meet the Civil Defense Battalion Commander at the Forward Incident Staging Area with the Emergency Briefing Packet',
            stepAr: 'استقبال قائد فرق الدفاع المدني في منطقة التجمع الميداني ومعه حقيبة المخططات وبيانات الطوارئ',
            correctOrder: 1,
            rationaleEn: 'Immediate greeting at the staging post establishes unified command without wasting precious firefighter minutes.',
            rationaleAr: 'استقبال قائد الدفاع المدني فوراً في نقطة التجمع يرسخ القيادة المشتركة ويوفر الوقت.'
          },
          {
            id: 'li2_s2',
            stepEn: 'Deliver structured tactical verbal handover covering fire sector, missing occupants, and utility cutoff status',
            stepAr: 'تقديم إيجاز تكتيكي منظم يغطي موقع الحريق، المفقودين، وحالة فصل الكهرباء والمخاطر',
            correctOrder: 2,
            rationaleEn: 'Tactical handover gives firefighters vital intelligence regarding interior conditions before entering the structure.',
            rationaleAr: 'الإيجاز التكتيكي يزود رجال الإطفاء ببيانات دقيقة عن المبنى والمحاصرين قبل الاقتحام.'
          },
          {
            id: 'li2_s3',
            stepEn: 'Coordinate with Airport Police to secure perimeter cordon, clear apparatus lanes, and unblock fire hydrants',
            stepAr: 'التنسيق مع شرطة المطار لفرض طوق أمني، تأمين مسارات الآليات الثقيلة، وخلو محابس الحريق',
            correctOrder: 3,
            rationaleEn: 'Clearing access routes ensures heavy aerial ladder trucks and water tankers reach key positions.',
            rationaleAr: 'تأمين المسارات يضمن وصول سيارات السلالم وصهاريج المياه لمواقع الإسناد دون عوائق.'
          },
          {
            id: 'li2_s4',
            stepEn: 'Establish joint radio liaison link between ERT Command and Civil Defense Incident Command Vehicle',
            stepAr: 'تثبيت قناة اتصال لاسلكي مشتركة بين قيادة الفريق الداخلي ومركبة قيادة الدفاع المدني',
            correctOrder: 4,
            rationaleEn: 'Direct interoperable radio frequency prevents fragmented communications and mixed tactical messages.',
            rationaleAr: 'توحيد التردد اللاسلكي يضمن سرعة تبادل التحديثات ويمنع تضارب التعليمات الميدانية.'
          },
          {
            id: 'li2_s5',
            stepEn: 'Maintain synchronized agency incident log documenting arrival times, deployed companies, and casualty transports',
            stepAr: 'إدارة سجل التنسيق الموحد لتوثيق أوقات وصول الفرق، الوحدات المشاركة، وحالات المصابين المنقولين',
            correctOrder: 5,
            rationaleEn: 'Legal and operational accountability demands meticulous real-time logging of all multi-agency actions.',
            rationaleAr: 'التوثيق المستمر يضمن الضبط العملياتي والقانوني لجميع قرارات وتدخلات الجهات المشاركة.'
          }
        ],
        tacticalOptions: [
          {
            id: 'li2_t1',
            textEn: 'Provide Civil Defense commander with laminated Floor Plans highlighting the compromised utility shaft and secondary exit stairs',
            textAr: 'تسليم قائد الدفاع المدني مخططات الطوابق مع تحديد مسار الكابلات المشتعل ودرج الطوارئ البديل',
            isCorrect: true,
            feedbackEn: 'Correct: Building architectural plans accelerate interior search and rescue operations.',
            feedbackAr: 'صحيح: المخططات الهندسية المعتمدة تختصر وقت البحث والإنقاذ داخل المبنى.'
          },
          {
            id: 'li2_t2',
            textEn: 'Refuse entrance to Civil Defense ladder trucks until next Sunday when facility managers return from leave',
            textAr: 'منع دخول آليات الدفاع المدني وطلب عودتهم يوم الأحد القادم بعد انتهاء إجازة مدير المرافق',
            isCorrect: false,
            feedbackEn: 'Absurd Violation: Obstructing emergency services during a disaster is illegal and lethal.',
            feedbackAr: 'خطأ كارثي لا يُعقل: إعاقة فرق الدفاع المدني أثناء الكوارث جريمة تعرض الأرواح للموت.'
          },
          {
            id: 'li2_t3',
            textEn: 'Designate and clear the East parking lot as the staging point for Red Crescent mass triage ambulances',
            textAr: 'تخصيص وإخلاء المواقف الشرقية لتكون نقطة فرز طبي وتمركز لسيارات إسعاف الهلال الأحمر',
            isCorrect: true,
            feedbackEn: 'Correct: Dedicated triage zones allow efficient flow of patient treatment and ambulance turnaround.',
            feedbackAr: 'صحيح: تحديد منطقة الفرز يضمن انسيابية علاج ونقل المصابين دون اختناقات مرورية.'
          },
          {
            id: 'li2_t4',
            textEn: 'Maintain continuous liaison presence at the Unified Command Post to provide internal knowledge to external commanders',
            textAr: 'التواجد المستمر في مقر القيادة الموحد لتزويد القادة الخارجيين بالمعلومات الميدانية للمنشأة',
            isCorrect: true,
            feedbackEn: 'Correct: ERT Liaison provides invaluable institutional knowledge to external incident chiefs.',
            feedbackAr: 'صحيح: مسؤول التنسيق يمثل حلقة الوصل لمعرفة المبنى وتسهيل مهام القادة الميدانيين.'
          }
        ]
      }
    ]
  }
];

// Flat list of all scenarios for quick lookup
export const ALL_SCENARIOS: Scenario[] = ERT_ROLES.flatMap(r => r.drills);
