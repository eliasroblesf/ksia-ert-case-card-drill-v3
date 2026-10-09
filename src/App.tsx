/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { 
  ERT_ROLES, 
  ERTRole, 
  Scenario, 
  ProcedureSequenceStep, 
  TacticalOption 
} from './data/scenarios';
import { 
  ShieldAlert, 
  Flame, 
  HeartPulse, 
  Footprints, 
  Radio, 
  Timer, 
  CheckCircle2, 
  XCircle, 
  AlertTriangle, 
  Download, 
  RefreshCcw, 
  ChevronRight, 
  ChevronLeft, 
  User, 
  Calendar, 
  ArrowUp, 
  ArrowDown, 
  Play, 
  Clock, 
  RotateCcw, 
  Award, 
  FileText, 
  Check, 
  AlertCircle,
  Building2,
  Users,
  Compass,
  Lock,
  Unlock,
  BadgeCheck
} from 'lucide-react';
import { jsPDF } from 'jspdf';
import confetti from 'canvas-confetti';
import { PWAInstallButton } from './components/PWAInstallButton';
import { OfflineIndicator } from './components/OfflineIndicator';

type AppStage = 
  | 'REGISTRATION' 
  | 'SCENARIO_BRIEF' 
  | 'STEP_LEVEL' 
  | 'STEP_SEQUENCE' 
  | 'STEP_TACTICAL' 
  | 'DRILL_RESULT' 
  | 'FULL_REPORT';

const REQUIRED_ROLES_COUNT = 3;

interface UserProfile {
  fullName: string;
  employeeId: string;
  assessmentDate: string;
  selectedRoleId: string;
}

export interface DrillRecord {
  scenario: Scenario;
  selectedLevel: string;
  orderedStepIds: string[];
  selectedTacticalIds: string[];
  elapsedSeconds: number;
  totalScore: number;
  levelScore: number;
  sequenceScore: number;
  tacticalScore: number;
  isPassed: boolean;
  correctFeedback: string[];
  improvementFeedback: string[];
}

export interface CompletedRoleRecord {
  roleId: string;
  role: ERTRole;
  drills: [DrillRecord, DrillRecord];
  averageScore: number;
  totalTime: number;
  isPassed: boolean;
  completedAt: string;
}

// Visual themes for ERT roles with vibrant primary colors
interface RoleVisualTheme {
  primaryColor: string; // hex
  iconBgClass: string;
  iconTextClass: string;
  activeBorderClass: string;
  activeBgClass: string;
  activeRingClass: string;
  badgeBgClass: string;
  badgeTextClass: string;
  headerIconClass: string;
}

const ROLE_THEMES: Record<string, RoleVisualTheme> = {
  team_leader: {
    primaryColor: '#2563eb', // Command Royal Blue
    iconBgClass: 'bg-blue-500/20 border border-blue-400/60 text-blue-400 shadow-sm shadow-blue-500/20',
    iconTextClass: 'text-blue-400',
    activeBorderClass: 'border-blue-400',
    activeBgClass: 'bg-blue-950/40',
    activeRingClass: 'ring-blue-400',
    badgeBgClass: 'bg-blue-500/20',
    badgeTextClass: 'text-blue-300 border border-blue-400/40',
    headerIconClass: 'bg-blue-500 text-white shadow-blue-500/30'
  },
  fire_suppression: {
    primaryColor: '#ef4444', // Tactical Flame Red
    iconBgClass: 'bg-red-500/20 border border-red-400/60 text-red-400 shadow-sm shadow-red-500/20',
    iconTextClass: 'text-red-400',
    activeBorderClass: 'border-red-400',
    activeBgClass: 'bg-red-950/40',
    activeRingClass: 'ring-red-400',
    badgeBgClass: 'bg-red-500/20',
    badgeTextClass: 'text-red-300 border border-red-400/40',
    headerIconClass: 'bg-red-500 text-white shadow-red-500/30'
  },
  casualty_care: {
    primaryColor: '#10b981', // Medic Emerald Green
    iconBgClass: 'bg-emerald-500/20 border border-emerald-400/60 text-emerald-400 shadow-sm shadow-emerald-500/20',
    iconTextClass: 'text-emerald-400',
    activeBorderClass: 'border-emerald-400',
    activeBgClass: 'bg-emerald-950/40',
    activeRingClass: 'ring-emerald-400',
    badgeBgClass: 'bg-emerald-500/20',
    badgeTextClass: 'text-emerald-300 border border-emerald-400/40',
    headerIconClass: 'bg-emerald-500 text-white shadow-emerald-500/30'
  },
  evacuation_support: {
    primaryColor: '#f59e0b', // Safety Amber / High-Vis Gold
    iconBgClass: 'bg-amber-500/20 border border-amber-400/60 text-amber-400 shadow-sm shadow-amber-500/20',
    iconTextClass: 'text-amber-400',
    activeBorderClass: 'border-amber-400',
    activeBgClass: 'bg-amber-950/40',
    activeRingClass: 'ring-amber-400',
    badgeBgClass: 'bg-amber-500/20',
    badgeTextClass: 'text-amber-300 border border-amber-400/40',
    headerIconClass: 'bg-amber-500 text-slate-950 shadow-amber-500/30'
  },
  liaison: {
    primaryColor: '#8b5cf6', // Electric Telecom Violet
    iconBgClass: 'bg-purple-500/20 border border-purple-400/60 text-purple-400 shadow-sm shadow-purple-500/20',
    iconTextClass: 'text-purple-400',
    activeBorderClass: 'border-purple-400',
    activeBgClass: 'bg-purple-950/40',
    activeRingClass: 'ring-purple-400',
    badgeBgClass: 'bg-purple-500/20',
    badgeTextClass: 'text-purple-300 border border-purple-400/40',
    headerIconClass: 'bg-purple-500 text-white shadow-purple-500/30'
  }
};

const getRoleTheme = (roleId: string): RoleVisualTheme => {
  return ROLE_THEMES[roleId] || ROLE_THEMES.team_leader;
};

// Helper to shuffle array for randomized presentation
const shuffleArray = <T,>(array: T[]): T[] => {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

const getTodayDateString = (): string => {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

export default function App() {
  // Candidate Profile
  const [profile, setProfile] = useState<UserProfile>({
    fullName: '',
    employeeId: '',
    assessmentDate: getTodayDateString(),
    selectedRoleId: 'team_leader'
  });
  const [profileError, setProfileError] = useState<string>('');

  // 3-Role Assessments State
  const [completedRoles, setCompletedRoles] = useState<CompletedRoleRecord[]>([]);

  // Navigation Stage
  const [stage, setStage] = useState<AppStage>('REGISTRATION');
  const [activeDrillIndex, setActiveDrillIndex] = useState<0 | 1>(0); // 0 = Drill 1, 1 = Drill 2

  // In-progress drill records for the current active role
  const [currentRoleDrillRecords, setCurrentRoleDrillRecords] = useState<[DrillRecord | null, DrillRecord | null]>([null, null]);

  // Current Active Drill Step In-Progress State
  const [selectedLevel, setSelectedLevel] = useState<string>('');
  const [currentSequenceOrder, setCurrentSequenceOrder] = useState<ProcedureSequenceStep[]>([]);
  const [selectedTacticalIds, setSelectedTacticalIds] = useState<string[]>([]);
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState<boolean>(false);

  // Active Role & Scenario
  const activeRole: ERTRole = useMemo(() => {
    return ERT_ROLES.find(r => r.id === profile.selectedRoleId) || ERT_ROLES[0];
  }, [profile.selectedRoleId]);

  const activeScenario: Scenario = useMemo(() => {
    return activeRole.drills[activeDrillIndex] || activeRole.drills[0];
  }, [activeRole, activeDrillIndex]);

  // Current Role Visual Theme
  const activeRoleTheme = useMemo(() => {
    return getRoleTheme(activeRole.id);
  }, [activeRole.id]);

  // Seamless scroll to top on step transitions
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [stage, activeDrillIndex]);

  // Active Stopwatch
  useEffect(() => {
    let interval: number;
    if (isTimerRunning) {
      interval = window.setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isTimerRunning]);

  const formatMinSec = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Helper icon for ERT Role with primary color preservation
  const renderRoleIcon = (roleId: string, className = 'w-5 h-5') => {
    switch (roleId) {
      case 'team_leader':
        return <ShieldAlert className={className} />;
      case 'fire_suppression':
        return <Flame className={className} />;
      case 'casualty_care':
        return <HeartPulse className={className} />;
      case 'evacuation_support':
        return <Footprints className={className} />;
      case 'liaison':
        return <Radio className={className} />;
      default:
        return <ShieldAlert className={className} />;
    }
  };

  // Initialize Drill Scenario Brief
  const initScenarioBrief = useCallback((drillIdx: 0 | 1) => {
    setActiveDrillIndex(drillIdx);
    const scen = activeRole.drills[drillIdx];
    setSelectedLevel('');
    // Shuffle steps initially so participant must sort them
    setCurrentSequenceOrder(shuffleArray(scen.procedureSequenceSteps));
    setSelectedTacticalIds([]);
    setElapsedSeconds(0);
    setIsTimerRunning(false);
    setStage('SCENARIO_BRIEF');
  }, [activeRole]);

  // Check which role IDs are already completed
  const completedRoleIds = useMemo(() => {
    return completedRoles.map(r => r.roleId);
  }, [completedRoles]);

  // Handle Profile Submit / Start Role Drill
  const handleStartActivity = () => {
    if (!profile.fullName.trim()) {
      setProfileError('Please enter your full name / يرجى إدخال الاسم بالكامل');
      return;
    }
    if (!profile.employeeId.trim()) {
      setProfileError('Please enter your employee ID / يرجى إدخال الرقم الوظيفي');
      return;
    }
    if (!profile.assessmentDate) {
      setProfileError('Please select the assessment date / يرجى تحديد تاريخ التقييم');
      return;
    }

    setProfileError('');
    // Reset drill records for this specific role attempt
    setCurrentRoleDrillRecords([null, null]);
    initScenarioBrief(0);
  };

  // Click "ACT NOW" -> Starts the clock and navigates to Step 1 (Level)
  const handleActNow = () => {
    setElapsedSeconds(0);
    setIsTimerRunning(true);
    setStage('STEP_LEVEL');
  };

  // Step 1: Proceed from Emergency Level to Procedure Sequence
  const handleProceedToSequence = () => {
    if (!selectedLevel) return;
    setStage('STEP_SEQUENCE');
  };

  // Step 2: Sequence Step Swapping (Up / Down)
  const handleMoveStep = (currentIndex: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (targetIndex < 0 || targetIndex >= currentSequenceOrder.length) return;

    setCurrentSequenceOrder(prev => {
      const next = [...prev];
      const temp = next[currentIndex];
      next[currentIndex] = next[targetIndex];
      next[targetIndex] = temp;
      return next;
    });
  };

  // Step 2: Proceed from Sequence to Tactical Actions
  const handleProceedToTactical = () => {
    setStage('STEP_TACTICAL');
  };

  // Step 3: Toggle Tactical Action Checkbox
  const handleToggleTactical = (optId: string) => {
    setSelectedTacticalIds(prev => 
      prev.includes(optId) ? prev.filter(id => id !== optId) : [...prev, optId]
    );
  };

  // Step 3: Complete & Score the Drill
  const handleCompleteDrill = () => {
    setIsTimerRunning(false);

    // 1. Level Score (30 pts)
    const isLevelCorrect = selectedLevel === activeScenario.correctLevel;
    const levelScore = isLevelCorrect ? 30 : 0;

    // 2. Sequence Score (35 pts)
    const totalSteps = activeScenario.procedureSequenceSteps.length;
    let correctPositionCount = 0;
    const correctStepFeedback: string[] = [];
    const improvementStepFeedback: string[] = [];

    currentSequenceOrder.forEach((step, index) => {
      const currentPos = index + 1;
      if (step.correctOrder === currentPos) {
        correctPositionCount++;
        correctStepFeedback.push(`Step ${currentPos} correctly ordered: "${step.stepEn}" (${step.rationaleEn})`);
      } else {
        improvementStepFeedback.push(
          `Sequence order correction: "${step.stepEn}" was placed at position #${currentPos}, but should be executed at Step #${step.correctOrder} (${step.rationaleEn})`
        );
      }
    });

    const sequenceScore = Math.round((correctPositionCount / totalSteps) * 35);

    // 3. Tactical Actions Score (35 pts)
    const correctOptions = activeScenario.tacticalOptions.filter(o => o.isCorrect);
    const wrongOptions = activeScenario.tacticalOptions.filter(o => !o.isCorrect);

    let correctSelectedCount = 0;
    let wrongSelectedCount = 0;

    activeScenario.tacticalOptions.forEach(opt => {
      const isSelected = selectedTacticalIds.includes(opt.id);
      if (opt.isCorrect) {
        if (isSelected) {
          correctSelectedCount++;
          correctStepFeedback.push(`Tactical action verified: "${opt.textEn}" - ${opt.feedbackEn}`);
        } else {
          improvementStepFeedback.push(`Missed vital tactical priority: "${opt.textEn}" - ${opt.feedbackEn}`);
        }
      } else {
        if (isSelected) {
          wrongSelectedCount++;
          improvementStepFeedback.push(`Hazardous action erroneously selected: "${opt.textEn}" - ${opt.feedbackEn}`);
        } else {
          correctStepFeedback.push(`Appropriately avoided prohibited action: "${opt.textEn}"`);
        }
      }
    });

    const correctRatio = correctOptions.length > 0 ? (correctSelectedCount / correctOptions.length) : 1;
    const rawTactical = (correctRatio * 35) - (wrongSelectedCount * 12);
    const tacticalScore = Math.max(0, Math.min(35, Math.round(rawTactical)));

    const totalScore = Math.min(100, Math.max(0, levelScore + sequenceScore + tacticalScore));
    const isPassed = totalScore >= 70;

    // Compile comprehensive Level feedback
    const finalCorrectList: string[] = [];
    const finalImprovementList: string[] = [];

    if (isLevelCorrect) {
      finalCorrectList.unshift(`Correctly classified as ${activeScenario.correctLevel}: ${activeScenario.levelRationaleEn}`);
    } else {
      finalImprovementList.unshift(
        `Incorrect classification (${selectedLevel || 'None'}): The incident is ${activeScenario.correctLevel}. Rationale: ${activeScenario.levelRationaleEn}`
      );
    }

    finalCorrectList.push(...correctStepFeedback);
    finalImprovementList.push(...improvementStepFeedback);

    const record: DrillRecord = {
      scenario: activeScenario,
      selectedLevel,
      orderedStepIds: currentSequenceOrder.map(s => s.id),
      selectedTacticalIds,
      elapsedSeconds,
      totalScore,
      levelScore,
      sequenceScore,
      tacticalScore,
      isPassed,
      correctFeedback: finalCorrectList,
      improvementFeedback: finalImprovementList
    };

    const updatedDrillRecords: [DrillRecord | null, DrillRecord | null] = [...currentRoleDrillRecords];
    updatedDrillRecords[activeDrillIndex] = record;
    setCurrentRoleDrillRecords(updatedDrillRecords);

    // If finishing Drill 2, this entire role assessment is completed!
    if (activeDrillIndex === 1 && updatedDrillRecords[0] !== null) {
      const drill1 = updatedDrillRecords[0];
      const drill2 = record;
      const roleAvg = Math.round((drill1.totalScore + drill2.totalScore) / 2);
      const roleTotalTime = drill1.elapsedSeconds + drill2.elapsedSeconds;
      const rolePassed = drill1.isPassed && drill2.isPassed;

      const completedRecord: CompletedRoleRecord = {
        roleId: activeRole.id,
        role: activeRole,
        drills: [drill1, drill2],
        averageScore: roleAvg,
        totalTime: roleTotalTime,
        isPassed: rolePassed,
        completedAt: new Date().toLocaleTimeString()
      };

      setCompletedRoles(prev => {
        // Replace if retrying this role, or append
        const filtered = prev.filter(r => r.roleId !== activeRole.id);
        const nextList = [...filtered, completedRecord];
        
        // If all 3 roles completed, fire celebratory confetti
        if (nextList.length >= REQUIRED_ROLES_COUNT) {
          confetti({
            particleCount: 150,
            spread: 90,
            origin: { y: 0.5 },
            colors: ['#2563eb', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6']
          });
        }
        return nextList;
      });
    }

    if (isPassed && activeDrillIndex === 0) {
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#0f172a', '#10b981', '#f59e0b']
      });
    }

    setStage('DRILL_RESULT');
  };

  // Check whether candidate has completed all 3 required role assessments
  const isThreeRolesCompleted = completedRoles.length >= REQUIRED_ROLES_COUNT;

  // Find the first uncompleted role ID to recommend next
  const nextRecommendedRoleId = useMemo(() => {
    const uncompleted = ERT_ROLES.find(r => !completedRoleIds.includes(r.id));
    return uncompleted ? uncompleted.id : ERT_ROLES[0].id;
  }, [completedRoleIds]);

  // Handler to advise candidate to pick their next role
  const handleSelectNextRole = () => {
    // Select an uncompleted role automatically
    setProfile(prev => ({
      ...prev,
      selectedRoleId: nextRecommendedRoleId
    }));
    setCurrentRoleDrillRecords([null, null]);
    setStage('REGISTRATION');
  };

  // Grand summary stats across all completed roles (up to 3 roles, 6 drills)
  const masterStats = useMemo(() => {
    if (completedRoles.length === 0) return null;
    const totalScoreSum = completedRoles.reduce((sum, r) => sum + r.averageScore, 0);
    const avgScore = Math.round(totalScoreSum / completedRoles.length);
    const totalTime = completedRoles.reduce((sum, r) => sum + r.totalTime, 0);
    const allPassed = completedRoles.every(r => r.isPassed);

    return {
      avgScore,
      totalTime,
      allPassed,
      completedCount: completedRoles.length
    };
  }, [completedRoles]);

  // Export Comprehensive Official 3-Role PDF Report
  const exportPDF = useCallback(() => {
    if (completedRoles.length < REQUIRED_ROLES_COUNT) {
      alert('You must complete all 3 assigned role assessments before downloading the official transcript.');
      return;
    }

    const doc = new jsPDF();
    const margin = 14;
    let y = 14;

    const ensureSpace = (needed: number) => {
      if (y + needed > 275) {
        doc.addPage();
        y = 16;
      }
    };

    // Official KSIA Navy Banner Header
    doc.setFillColor(15, 23, 42); // slate-900
    doc.rect(0, 0, 210, 30, 'F');

    doc.setTextColor(255, 255, 255);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text('KING SALMAN INTERNATIONAL AIRPORT (KSIA)', margin, 12);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text('Emergency Response Team (ERT) · Official 3-Role Individual Readiness Transcript', margin, 19);
    doc.text(`Certified Assessment Records · Standard KSIA-SOP-ERT-2026`, margin, 25);

    y = 36;

    // Candidate Profile Box
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(226, 232, 240);
    doc.rect(margin, y, 182, 20, 'FD');

    doc.setFontSize(8.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(71, 85, 105);
    doc.text('CANDIDATE INFORMATION & MANDATORY 3-ROLE REQUIREMENT STATUS', margin + 3, y + 5);

    doc.setFont('helvetica', 'normal');
    doc.setTextColor(15, 23, 42);
    doc.text(`Candidate Name: ${profile.fullName}    |    Employee ID: ${profile.employeeId}`, margin + 3, y + 11);
    doc.text(`Assessment Date: ${profile.assessmentDate}    |    Status: 3 of 3 Assigned Roles Completed (100% Fulfilled)`, margin + 3, y + 16);
    y += 24;

    // Master Score Qualification Banner
    const overallAvg = masterStats ? masterStats.avgScore : 0;
    const isQual = overallAvg >= 70;
    doc.setFillColor(isQual ? 240 : 254, isQual ? 253 : 242, isQual ? 244 : 242);
    doc.setDrawColor(isQual ? 187 : 254, isQual ? 247 : 202, isQual ? 208 : 202);
    doc.rect(margin, y, 182, 17, 'FD');

    doc.setFontSize(10.5);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(isQual ? 22 : 185, isQual ? 101 : 28, isQual ? 52 : 28);
    doc.text(
      `OVERALL QUALIFICATION: ${isQual ? 'CERTIFIED / PASS (3 ROLES)' : 'NEEDS IMPROVEMENT'}  |  CUMULATIVE AVERAGE: ${overallAvg} / 100`, 
      margin + 3, 
      y + 7
    );
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(71, 85, 105);
    const rolesSummaryStr = completedRoles.map(cr => `${cr.role.titleEn} (${cr.averageScore}%)`).join('  ·  ');
    doc.text(
      `Roles Evaluated: ${rolesSummaryStr}  |  Total Time: ${formatMinSec(masterStats?.totalTime || 0)}`,
      margin + 3,
      y + 13
    );
    y += 22;

    // Helper to print a single drill
    const printDrillSummary = (record: DrillRecord, drillNum: number, roleTitle: string) => {
      ensureSpace(42);
      doc.setFontSize(9.5);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(`Drill ${drillNum}: ${record.scenario.titleEn}`, margin, y, { maxWidth: 182 });
      y += 5;

      doc.setFontSize(8);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(71, 85, 105);
      doc.text(
        `Classification: ${record.selectedLevel} (Standard Key: ${record.scenario.correctLevel}) | Score: ${record.totalScore}/100 [Level: ${record.levelScore}/30, Seq: ${record.sequenceScore}/35, Tac: ${record.tacticalScore}/35] | Time: ${formatMinSec(record.elapsedSeconds)}`,
        margin,
        y
      );
      y += 5;

      // Key correct actions
      doc.setFont('helvetica', 'bold');
      doc.setFontSize(7.5);
      doc.setTextColor(22, 101, 52);
      doc.text('Key Correct Actions:', margin, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      record.correctFeedback.slice(0, 2).forEach(item => {
        ensureSpace(6);
        doc.text(`+ ${item}`, margin + 2, y, { maxWidth: 178 });
        y += 3.5;
      });

      // Areas for improvement
      y += 1;
      ensureSpace(8);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(185, 28, 28);
      doc.text('Areas for Improvement:', margin, y);
      y += 4;
      doc.setFont('helvetica', 'normal');
      if (record.improvementFeedback.length > 0) {
        record.improvementFeedback.slice(0, 2).forEach(item => {
          ensureSpace(6);
          doc.text(`- ${item}`, margin + 2, y, { maxWidth: 178 });
          y += 3.5;
        });
      } else {
        doc.setTextColor(71, 85, 105);
        doc.text('No errors recorded. Flawless procedural execution.', margin + 2, y);
        y += 3.5;
      }
      y += 4;
    };

    // Print all 3 completed roles
    completedRoles.forEach((roleRec, roleIdx) => {
      ensureSpace(20);
      // Role divider header
      doc.setFillColor(241, 245, 249);
      doc.rect(margin, y, 182, 8, 'F');
      doc.setFontSize(9);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(15, 23, 42);
      doc.text(
        `ROLE ${roleIdx + 1} OF 3: ${roleRec.role.titleEn.toUpperCase()} (${roleRec.role.code}) — AVERAGE SCORE: ${roleRec.averageScore} / 100`, 
        margin + 2, 
        y + 5.5
      );
      y += 11;

      // Drill 1
      printDrillSummary(roleRec.drills[0], 1, roleRec.role.titleEn);
      // Drill 2
      printDrillSummary(roleRec.drills[1], 2, roleRec.role.titleEn);
    });

    // Sign-Off Stamp
    ensureSpace(24);
    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.rect(margin, y, 182, 20, 'FD');
    doc.setFontSize(7.5);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100);
    doc.text('Certified by King Salman International Airport Emergency Response Training Section', margin + 3, y + 5);
    doc.text(`Official System Stamp · Candidate Ref: KSIA-ERT-${profile.employeeId} · Date: ${new Date().toLocaleDateString()}`, margin + 3, y + 10);
    doc.text('Assessing Evaluator Signature: _______________________      Accreditation Date: _______________', margin + 3, y + 15);

    doc.save(`KSIA_ERT_3Roles_Report_${profile.employeeId}_${profile.assessmentDate}.pdf`);
  }, [completedRoles, profile, masterStats]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-amber-400 selection:text-slate-950">
      <OfflineIndicator />

      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-slate-900/95 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
            {/* Primary-color role icon in header */}
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-black shrink-0 shadow-md ${activeRoleTheme.headerIconClass}`}>
              {renderRoleIcon(activeRole.id, 'w-5 h-5')}
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-xs text-slate-400 truncate">
                <span className="font-semibold text-amber-400">KSIA ERT</span>
                <span>·</span>
                <span>3-Role Assessment Program</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-white truncate">
                Case-Card Readiness Drill
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {stage !== 'REGISTRATION' && (
              <button
                onClick={() => {
                  if (confirm('Return to role selection? Current drill step in progress will be reset, but previously completed roles will be saved.')) {
                    setIsTimerRunning(false);
                    setStage('REGISTRATION');
                  }
                }}
                className="text-xs text-slate-400 hover:text-white px-2.5 py-1.5 rounded-lg bg-slate-800/80 border border-slate-700 hover:bg-slate-700 transition-colors flex items-center gap-1.5"
                title="Return to Roles List"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Role List</span>
              </button>
            )}
            <PWAInstallButton />
          </div>
        </div>

        {/* Candidate & 3-Role Progress Bar when in Drill */}
        {stage !== 'REGISTRATION' && (
          <div className="bg-slate-900/90 border-t border-slate-800/80 px-4 py-2 text-xs text-slate-400">
            <div className="max-w-3xl mx-auto flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2 truncate">
                <span className="text-slate-200 font-medium">{profile.fullName}</span>
                <span>·</span>
                <span>ID: {profile.employeeId}</span>
                <span>·</span>
                <span className={`font-semibold ${activeRoleTheme.iconTextClass}`}>
                  {activeRole.titleEn} ({activeRole.code})
                </span>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                {/* 3-Role Badge */}
                <span className="px-2 py-0.5 rounded bg-slate-800 text-amber-400 font-medium text-[11px] border border-amber-400/30">
                  Role {completedRoles.length + 1} of {REQUIRED_ROLES_COUNT}
                </span>
                <span className="px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-mono text-[11px]">
                  Drill {activeDrillIndex + 1} of 2
                </span>
                {isTimerRunning && (
                  <span className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                    <Clock className="w-3 h-3 animate-spin" />
                    {formatMinSec(elapsedSeconds)}
                  </span>
                )}
              </div>
            </div>
          </div>
        )}
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-3xl w-full mx-auto p-4 sm:p-6 pb-20">

        {/* 1. REGISTRATION & ROLE SELECTION SCREEN */}
        {stage === 'REGISTRATION' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Intro Hero with Explicit 3-Role Assessment Directive */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800/90 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xl">
              <div className="flex items-center gap-2 text-xs font-semibold text-amber-400 mb-2">
                <Award className="w-4 h-4" />
                <span>King Salman International Airport · Emergency Readiness</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                Individual Case-Card Assessment
              </h2>

              {/* MANDATORY 3-ROLE REQUIREMENT DIRECTIVE (Crucial User Requirement) */}
              <div className="mt-4 p-4 rounded-xl bg-amber-500/10 border-2 border-amber-400/40 text-slate-200 shadow-md">
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded-lg bg-amber-400 text-slate-950 font-black shrink-0 mt-0.5 shadow-sm">
                    <AlertTriangle className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div className="space-y-1.5 text-xs sm:text-sm leading-relaxed">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-extrabold text-white uppercase tracking-wider text-xs sm:text-sm">
                        Mandatory Requirement: Complete 3 Assigned Role Assessments
                      </span>
                      <span className="bg-amber-400 text-slate-950 text-[10px] font-black px-2 py-0.5 rounded">
                        3 ROLES REQUIRED
                      </span>
                    </div>
                    <p className="text-slate-200">
                      Each user must do <strong>3 Assigned Role Assessments</strong> of their choice. To finish the drill and be able to download your official readiness transcript, you must complete all 3 assigned role assessments. As soon as you finish each role, you will be advised to select a new role to perform until all 3 are completed.
                    </p>
                    <p className="text-amber-300/90 text-xs pt-0.5 font-medium border-t border-amber-400/20">
                      متطلب أساسي: يجب على كل متدرب إتمام 3 تقييمات أدوار من اختياره. للتمكن من إنهاء التدريب وتحميل تقرير التقييم المعتمد، يتعين عليك إكمال تقييم 3 أدوار استجابة مختلفة بالكامل. فور إنهاء كل دور، سيُطلب منك اختيار دور جديد حتى إتمام الأدوار الثلاثة.
                    </p>
                  </div>
                </div>

                {/* 3-Role Progress Tracker Status Cards */}
                <div className="mt-4 pt-3 border-t border-amber-400/20">
                  <div className="flex items-center justify-between text-xs font-bold text-slate-300 mb-2">
                    <span>ASSESSMENT COMPLETION PROGRESS</span>
                    <span className="text-amber-400 font-mono">
                      {completedRoles.length} / {REQUIRED_ROLES_COUNT} Roles Completed
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {[0, 1, 2].map((slotIdx) => {
                      const roleRecord = completedRoles[slotIdx];
                      const isDone = Boolean(roleRecord);
                      const isNext = !isDone && slotIdx === completedRoles.length;
                      const roleTheme = roleRecord ? getRoleTheme(roleRecord.roleId) : null;

                      return (
                        <div
                          key={slotIdx}
                          className={`p-3 rounded-xl border flex items-center gap-2.5 transition-all ${
                            isDone
                              ? 'bg-emerald-950/40 border-emerald-500/50 text-white'
                              : isNext
                              ? 'bg-amber-950/30 border-amber-400/60 text-slate-200 ring-1 ring-amber-400/50'
                              : 'bg-slate-950/60 border-slate-800 text-slate-500'
                          }`}
                        >
                          <div
                            className={`w-7 h-7 rounded-lg flex items-center justify-center font-bold text-xs shrink-0 ${
                              isDone
                                ? 'bg-emerald-500 text-slate-950'
                                : isNext
                                ? 'bg-amber-400 text-slate-950 font-black'
                                : 'bg-slate-800 text-slate-600'
                            }`}
                          >
                            {isDone ? <Check className="w-4 h-4 stroke-[3]" /> : slotIdx + 1}
                          </div>
                          <div className="min-w-0">
                            <div className="text-[10px] font-bold uppercase tracking-wider">
                              {isDone ? (
                                <span className="text-emerald-400">Role {slotIdx + 1} Complete</span>
                              ) : isNext ? (
                                <span className="text-amber-400">Role {slotIdx + 1} (Current Up Next)</span>
                              ) : (
                                <span>Role {slotIdx + 1} Pending</span>
                              )}
                            </div>
                            <div className="text-xs font-semibold truncate text-slate-200">
                              {roleRecord ? roleRecord.role.titleEn : `Assignment #${slotIdx + 1}`}
                            </div>
                            {roleRecord && (
                              <div className="text-[10px] text-emerald-400 font-mono">
                                Score: {roleRecord.averageScore}/100
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Report Download Lock Status */}
                  <div className="mt-3 flex items-center justify-between text-xs pt-2 border-t border-slate-800">
                    <div className="flex items-center gap-1.5 text-slate-400">
                      {isThreeRolesCompleted ? (
                        <Unlock className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <Lock className="w-4 h-4 text-amber-400" />
                      )}
                      <span>
                        {isThreeRolesCompleted
                          ? 'Official Report & Download Unlocked (3/3 Completed)'
                          : `Report Download Locked: Complete ${REQUIRED_ROLES_COUNT - completedRoles.length} more role assessment(s)`}
                      </span>
                    </div>

                    {isThreeRolesCompleted && (
                      <button
                        type="button"
                        onClick={() => setStage('FULL_REPORT')}
                        className="text-xs font-bold text-amber-400 hover:text-amber-300 underline flex items-center gap-1"
                      >
                        <span>View Master Report</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Candidate Form */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4">
              <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <User className="w-4 h-4 text-amber-400" />
                Candidate Information / بيانات الموظف
              </h3>

              {profileError && (
                <div className="p-3 bg-red-950/60 border border-red-800 text-red-200 text-xs rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0" />
                  <span>{profileError}</span>
                </div>
              )}

              {/* Full Name */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Full Name / الاسم الثلاثي <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Abdullah Al-Harbi"
                  value={profile.fullName}
                  onChange={e => setProfile(prev => ({ ...prev, fullName: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Employee ID */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Employee ID / الرقم الوظيفي <span className="text-amber-400">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. KSIA-48291"
                  value={profile.employeeId}
                  onChange={e => setProfile(prev => ({ ...prev, employeeId: e.target.value }))}
                  className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                />
              </div>

              {/* Assessment Date (Pre-filled calendar) */}
              <div>
                <label className="block text-xs font-medium text-slate-300 mb-1.5">
                  Date of Assessment / تاريخ التقييم <span className="text-amber-400">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={profile.assessmentDate}
                    onChange={e => setProfile(prev => ({ ...prev, assessmentDate: e.target.value }))}
                    className="w-full bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-400 focus:ring-1 focus:ring-amber-400"
                  />
                </div>
                <span className="text-[11px] text-slate-500 mt-1 block">
                  Pre-filled with today's calendar date. Click to change if needed.
                </span>
              </div>

              {/* Select ERT Role - With PRIMARY COLOR ICONS (Not greyscaled) */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-medium text-slate-300">
                    Select ERT Role to Assess / اختر دور الاستجابة للطوارئ <span className="text-amber-400">*</span>
                  </label>
                  <span className="text-[11px] text-slate-400">
                    Completed: {completedRoles.length} of 3
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {ERT_ROLES.map(role => {
                    const isSelected = profile.selectedRoleId === role.id;
                    const isAlreadyCompleted = completedRoleIds.includes(role.id);
                    const completedRecord = completedRoles.find(r => r.roleId === role.id);
                    const theme = getRoleTheme(role.id);

                    return (
                      <button
                        key={role.id}
                        type="button"
                        onClick={() => setProfile(prev => ({ ...prev, selectedRoleId: role.id }))}
                        className={`text-left p-3.5 rounded-xl border transition-all flex items-start gap-3 relative ${
                          isSelected
                            ? `${theme.activeBgClass} ${theme.activeBorderClass} text-white shadow-lg ${theme.activeRingClass} ring-2`
                            : isAlreadyCompleted
                            ? 'bg-slate-950/80 border-emerald-500/40 text-slate-300 hover:border-emerald-400'
                            : 'bg-slate-950/70 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-950'
                        }`}
                      >
                        {/* VIBRANT PRIMARY COLOR ICON (Never greyscaled) */}
                        <div className={`p-2.5 rounded-xl shrink-0 mt-0.5 transition-transform ${theme.iconBgClass}`}>
                          {renderRoleIcon(role.id, 'w-5 h-5')}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center justify-between gap-1">
                            <div className="flex items-center gap-1.5 min-w-0 truncate">
                              <span className="font-bold text-xs text-white truncate">{role.titleEn}</span>
                              <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold ${theme.badgeBgClass} ${theme.badgeTextClass}`}>
                                {role.code}
                              </span>
                            </div>

                            {/* Completed Status Checkmark */}
                            {isAlreadyCompleted && (
                              <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-bold bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 shrink-0">
                                <Check className="w-3 h-3 stroke-[3]" />
                                <span>{completedRecord ? `${completedRecord.averageScore}%` : 'Done'}</span>
                              </span>
                            )}
                          </div>

                          <div className="text-[11px] text-slate-400 truncate mt-0.5">{role.titleAr}</div>
                          <div className="text-[10px] text-slate-500 mt-1 line-clamp-1">{role.descriptionEn}</div>
                        </div>
                      </button>
                    );
                  })}
                </div>

                {completedRoleIds.includes(profile.selectedRoleId) && (
                  <p className="text-[11px] text-amber-400/90 mt-2 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                    <span>
                      You have already completed this role. You can re-assess it to improve your score, or choose an uncompleted role to satisfy the 3-role assessment requirement.
                    </span>
                  </p>
                )}
              </div>

              {/* Start Assessment CTA */}
              <div className="pt-3 space-y-2">
                <button
                  type="button"
                  onClick={handleStartActivity}
                  className="w-full bg-amber-400 hover:bg-amber-300 text-slate-950 font-black py-3.5 px-4 rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
                >
                  <span>
                    {completedRoles.length === 0
                      ? 'START ROLE ASSESSMENT (1 OF 3)'
                      : completedRoles.length === 1
                      ? 'START ROLE ASSESSMENT (2 OF 3)'
                      : completedRoles.length === 2
                      ? 'START FINAL ROLE ASSESSMENT (3 OF 3)'
                      : 'START ROLE ASSESSMENT'}
                  </span>
                  <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                </button>

                {isThreeRolesCompleted && (
                  <button
                    type="button"
                    onClick={() => setStage('FULL_REPORT')}
                    className="w-full py-3 px-4 rounded-xl border border-emerald-500/50 bg-emerald-950/40 hover:bg-emerald-900/40 text-emerald-300 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <Award className="w-4 h-4" />
                    <span>All 3 Roles Completed! View Master Report & Download PDF</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        )}

        {/* 2. SCENARIO BRIEF (UNTIMED) */}
        {stage === 'SCENARIO_BRIEF' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Header info with Primary-color role badge */}
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider">
                <div className={`p-1 rounded-md ${activeRoleTheme.iconBgClass}`}>
                  {renderRoleIcon(activeRole.id, 'w-3.5 h-3.5')}
                </div>
                <span className={activeRoleTheme.iconTextClass}>
                  Role ({completedRoles.length + 1} of 3) · Drill {activeDrillIndex + 1} of 2 · {activeRole.titleEn}
                </span>
              </div>
              <div className="text-xs bg-slate-800 text-slate-300 px-2.5 py-1 rounded-lg border border-slate-700">
                Phase 1: Briefing (Untimed)
              </div>
            </div>

            {/* Case Scenario Card */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-4 shadow-xl">
              <div className="border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${activeRoleTheme.badgeBgClass} ${activeRoleTheme.badgeTextClass}`}>
                    DRILL {activeDrillIndex + 1} OF 2
                  </span>
                  <span className="text-xs text-slate-400">·</span>
                  <span className="text-xs text-slate-400">{activeRole.titleEn}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-black text-white">
                  {activeScenario.titleEn}
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
                  {activeScenario.titleAr}
                </p>
              </div>

              <div className="space-y-3 text-xs sm:text-sm">
                <div>
                  <span className="text-amber-400 font-bold block text-xs">Location / الموقع:</span>
                  <p className="text-slate-200 mt-0.5">{activeScenario.locationEn}</p>
                  <p className="text-slate-400 text-xs">{activeScenario.locationAr}</p>
                </div>

                <div>
                  <span className="text-amber-400 font-bold block text-xs">Incident Context / ملابسات الحادث:</span>
                  <p className="text-slate-200 mt-0.5">{activeScenario.contextEn}</p>
                  <p className="text-slate-400 text-xs">{activeScenario.contextAr}</p>
                </div>

                <div>
                  <span className="text-amber-400 font-bold block text-xs">Threat & Hazard Severity / طبيعة الخطر:</span>
                  <p className="text-slate-200 mt-0.5">{activeScenario.threatEn}</p>
                  <p className="text-slate-400 text-xs">{activeScenario.threatAr}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px]">Occupancy / الشاغلين:</span>
                    <p className="text-slate-300 text-xs mt-1">{activeScenario.occupancyEn}</p>
                  </div>
                  <div className="bg-slate-950 p-3 rounded-xl border border-slate-800">
                    <span className="text-slate-400 font-semibold block text-[11px]">Operational Constraints / القيود:</span>
                    <p className="text-slate-300 text-xs mt-1">{activeScenario.constraintsEn}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Standard Procedure Sequence Guide */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-3">
              <div className="flex items-center gap-2 text-slate-200 font-bold text-sm">
                <FileText className="w-4 h-4 text-amber-400" />
                <span>Standard Procedure Sequence Guide / دليل التسلسل القياسي للإجراءات</span>
              </div>
              <p className="text-xs text-slate-400">
                Review the official KSIA operational procedure sequence below before starting the timed evaluation.
              </p>

              <div className="space-y-2 mt-3">
                {activeScenario.procedureGuideEn.map((stepText, idx) => (
                  <div key={idx} className="flex items-start gap-2.5 p-2.5 rounded-xl bg-slate-950/80 border border-slate-800/80 text-xs">
                    <span className="w-5 h-5 rounded-full bg-slate-800 text-amber-400 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </span>
                    <div className="space-y-0.5 min-w-0">
                      <p className="text-slate-200 font-medium">{stepText}</p>
                      <p className="text-slate-400 text-[11px]">{activeScenario.procedureGuideAr[idx]}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notice & CTA */}
            <div className="bg-amber-400/10 border border-amber-400/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="space-y-0.5 text-center sm:text-left">
                <span className="text-xs font-bold text-amber-400 uppercase tracking-wider block">
                  Untimed Briefing Complete
                </span>
                <p className="text-xs text-slate-300">
                  The assessment clock will start immediately once you tap <strong>ACT NOW</strong>.
                </p>
              </div>

              <button
                type="button"
                onClick={handleActNow}
                className="w-full sm:w-auto px-6 py-3.5 bg-amber-400 hover:bg-amber-300 text-slate-950 font-black rounded-xl shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-95 shrink-0"
              >
                <Play className="w-4 h-4 fill-current" />
                <span>ACT NOW / ابدأ الآن</span>
              </button>
            </div>
          </div>
        )}

        {/* 3. STEP 1: SELECT EMERGENCY LEVEL */}
        {stage === 'STEP_LEVEL' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Screen 1 of 3 · Emergency Classification
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Select the Emergency Level / حدد مستوى الطوارئ
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatMinSec(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Short Scenario Reminder */}
            <div className="bg-slate-900/60 border border-slate-800 rounded-xl p-3.5 text-xs text-slate-400">
              <span className="text-slate-300 font-semibold block text-xs">{activeScenario.titleEn}</span>
              <p className="mt-1 line-clamp-2 text-slate-400">{activeScenario.threatEn}</p>
            </div>

            {/* Emergency Level Options */}
            <div className="space-y-3">
              {[
                {
                  level: 'Level 1' as const,
                  titleEn: 'Level 1: Localized Incident',
                  titleAr: 'المستوى 1: حادث موضعي محدود',
                  descEn: 'Confined to a single room or sector; can be safely managed and mitigated using internal ERT resources without full Civil Defense.',
                  descAr: 'محصور في غرفة أو نطاق ضيق، ويمكن احتوؤه بقدرات الفريق الداخلي.'
                },
                {
                  level: 'Level 2' as const,
                  titleEn: 'Level 2: Facility Emergency',
                  titleAr: 'المستوى 2: طوارئ على مستوى المنشأة',
                  descEn: 'Threat extends across building floor or utility risers; requires building evacuation, full ERT activation, and external Civil Defense / Red Crescent response.',
                  descAr: 'الخطر يمتد عبر مرافق المبنى؛ يستدعي إخلاء المبنى وتدخلاً خارجياً من الدفاع المدني والهلال الأحمر.'
                },
                {
                  level: 'Level 3' as const,
                  titleEn: 'Level 3: Major Aerodrome Disaster',
                  titleAr: 'المستوى 3: كارثة كبرى على مستوى المطار',
                  descEn: 'Severe multi-floor fire or mass casualty crisis exceeding facility capacity; triggers unified inter-agency airport crisis mobilization.',
                  descAr: 'حريق هيكلي متعدد الطوابق أو كارثة إصابات كبرى تتطلب تعبئة شاملة لكافة أجهزة المطار والجهات الأمنية.'
                }
              ].map(opt => {
                const isSelected = selectedLevel === opt.level;
                return (
                  <button
                    key={opt.level}
                    type="button"
                    onClick={() => setSelectedLevel(opt.level)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 ring-2 ring-amber-400 shadow-md shadow-amber-400/10'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className={`text-sm sm:text-base font-bold ${isSelected ? 'text-amber-400' : 'text-white'}`}>
                        {opt.titleEn}
                      </span>
                      <span className={`w-5 h-5 rounded-full border flex items-center justify-center shrink-0 ${
                        isSelected ? 'border-amber-400 bg-amber-400 text-slate-950' : 'border-slate-600'
                      }`}>
                        {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400 mt-0.5">{opt.titleAr}</div>
                    <p className="text-xs text-slate-300 mt-2 leading-relaxed">{opt.descEn}</p>
                  </button>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="button"
                disabled={!selectedLevel}
                onClick={handleProceedToSequence}
                className={`w-full py-3.5 px-4 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-all ${
                  selectedLevel
                    ? 'bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 active:scale-[0.99]'
                    : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-700/50'
                }`}
              >
                <span>NEXT: PROCEDURE SEQUENCE</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* 4. STEP 2: PROCEDURE SEQUENCE */}
        {stage === 'STEP_SEQUENCE' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Screen 2 of 3 · Standard Sequence
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Order the Operational Procedure / رتّب تسلسل الإجراءات
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatMinSec(elapsedSeconds)}</span>
              </div>
            </div>

            {/* Instructions */}
            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block mb-0.5">Instructions:</span>
              All options below are genuine, required actions for this scenario. Tap the <strong>▲ Up</strong> and <strong>▼ Down</strong> arrows on each step to arrange them into their correct chronological execution order (from Step 1 to Step {currentSequenceOrder.length}).
            </div>

            {/* Reorderable Step List */}
            <div className="space-y-2.5">
              {currentSequenceOrder.map((step, idx) => {
                const isFirst = idx === 0;
                const isLast = idx === currentSequenceOrder.length - 1;
                return (
                  <div
                    key={step.id}
                    className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between gap-3 shadow-md"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="w-7 h-7 rounded-lg bg-amber-400/20 text-amber-400 border border-amber-400/40 flex items-center justify-center font-black text-xs shrink-0 mt-0.5">
                        {idx + 1}
                      </div>
                      <div className="space-y-0.5 min-w-0">
                        <p className="text-xs sm:text-sm font-semibold text-white leading-snug">
                          {step.stepEn}
                        </p>
                        <p className="text-[11px] text-slate-400">
                          {step.stepAr}
                        </p>
                      </div>
                    </div>

                    {/* Up / Down Controls */}
                    <div className="flex flex-col gap-1 shrink-0">
                      <button
                        type="button"
                        disabled={isFirst}
                        onClick={() => handleMoveStep(idx, 'up')}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isFirst
                            ? 'bg-slate-950 text-slate-700 border-slate-800 cursor-not-allowed'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950'
                        }`}
                        title="Move Up"
                      >
                        <ArrowUp className="w-3.5 h-3.5" />
                      </button>
                      <button
                        type="button"
                        disabled={isLast}
                        onClick={() => handleMoveStep(idx, 'down')}
                        className={`p-1.5 rounded-lg border text-xs transition-colors ${
                          isLast
                            ? 'bg-slate-950 text-slate-700 border-slate-800 cursor-not-allowed'
                            : 'bg-slate-800 text-slate-200 border-slate-700 hover:bg-slate-700 active:bg-amber-400 active:text-slate-950'
                        }`}
                        title="Move Down"
                      >
                        <ArrowDown className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Next Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleProceedToTactical}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/20 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
              >
                <span>NEXT: TACTICAL ACTIONS</span>
                <ChevronRight className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* 5. STEP 3: IMMEDIATE TACTICAL ACTIONS */}
        {stage === 'STEP_TACTICAL' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Step Wizard Header */}
            <div className="flex items-center justify-between gap-2 border-b border-slate-800 pb-3">
              <div>
                <span className="text-xs text-amber-400 font-bold uppercase tracking-wider">
                  Screen 3 of 3 · Role Tactical Execution
                </span>
                <h2 className="text-base sm:text-lg font-bold text-white mt-0.5">
                  Tactical Actions for {activeRole.titleEn}
                </h2>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-900 border border-slate-700 text-xs font-mono font-bold text-amber-400">
                <Timer className="w-3.5 h-3.5" />
                <span>{formatMinSec(elapsedSeconds)}</span>
              </div>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300">
              <span className="font-bold text-amber-400 block mb-0.5">Instructions:</span>
              Select all authorized, critical tactical actions relevant to your role. Be vigilant: avoid hazardous, unauthorized, or dangerous actions.
            </div>

            {/* Tactical Options */}
            <div className="space-y-3">
              {activeScenario.tacticalOptions.map(opt => {
                const isSelected = selectedTacticalIds.includes(opt.id);
                return (
                  <button
                    key={opt.id}
                    type="button"
                    onClick={() => handleToggleTactical(opt.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex items-start gap-3.5 ${
                      isSelected
                        ? 'bg-amber-400/15 border-amber-400 ring-1 ring-amber-400 shadow-sm'
                        : 'bg-slate-900 border-slate-800 hover:border-slate-700 hover:bg-slate-850'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center shrink-0 mt-0.5 ${
                      isSelected ? 'bg-amber-400 border-amber-400 text-slate-950' : 'border-slate-600 bg-slate-950'
                    }`}>
                      {isSelected && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </div>
                    <div className="space-y-1 min-w-0">
                      <p className={`text-xs sm:text-sm font-semibold leading-snug ${isSelected ? 'text-white' : 'text-slate-200'}`}>
                        {opt.textEn}
                      </p>
                      <p className="text-[11px] text-slate-400">
                        {opt.textAr}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Complete Drill CTA */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleCompleteDrill}
                className="w-full py-3.5 px-4 rounded-xl font-black text-sm bg-amber-400 hover:bg-amber-300 text-slate-950 shadow-lg shadow-amber-400/30 flex items-center justify-center gap-2 transition-transform active:scale-[0.99]"
              >
                <span>COMPLETE DRILL & SUBMIT</span>
                <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>
          </div>
        )}

        {/* 6. DRILL RESULT & STATS SCREEN (With 3-Role Advisory Requirement) */}
        {stage === 'DRILL_RESULT' && currentRoleDrillRecords[activeDrillIndex] && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {(() => {
              const record = currentRoleDrillRecords[activeDrillIndex]!;
              const isDrill1 = activeDrillIndex === 0;
              const isRoleFullyComplete = !isDrill1 && currentRoleDrillRecords[0] !== null;

              return (
                <>
                  {/* Result Banner */}
                  <div className={`p-6 rounded-2xl border text-center space-y-2 shadow-xl ${
                    record.isPassed
                      ? 'bg-emerald-950/40 border-emerald-500/50 text-emerald-300'
                      : 'bg-amber-950/40 border-amber-500/50 text-amber-300'
                  }`}>
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-slate-900 border border-current text-current mb-1">
                      {record.isPassed ? <CheckCircle2 className="w-6 h-6" /> : <AlertTriangle className="w-6 h-6" />}
                    </div>
                    <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
                      <span>{activeRole.titleEn}</span>
                      <span>·</span>
                      <span>Drill {activeDrillIndex + 1} of 2</span>
                    </div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">
                      {record.isPassed ? 'DRILL PASSED / اجتياز ناجح' : 'NEEDS PRACTICE / يلزم التدريب'}
                    </h2>
                    <div className="text-3xl sm:text-4xl font-black text-white font-mono">
                      {record.totalScore} <span className="text-sm font-normal text-slate-400">/ 100</span>
                    </div>
                    <div className="flex items-center justify-center gap-3 text-xs text-slate-400 pt-1">
                      <span>Time: {formatMinSec(record.elapsedSeconds)}</span>
                      <span>·</span>
                      <span>Target: ≥ 70 Pts</span>
                      <span>·</span>
                      <span>Level: {record.selectedLevel}</span>
                    </div>
                  </div>

                  {/* CRITICAL USER REQUIREMENT: ADVISORY BANNER WHEN ROLE COMPLETES */}
                  {isRoleFullyComplete && (
                    <div className="p-5 rounded-2xl bg-gradient-to-r from-blue-950/50 via-slate-900 to-amber-950/40 border-2 border-amber-400/60 shadow-xl space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="p-2.5 rounded-xl bg-amber-400 text-slate-950 font-black shrink-0 mt-0.5 shadow-md">
                          <Compass className="w-6 h-6 stroke-[2.5]" />
                        </div>
                        <div className="space-y-1.5 flex-1 text-xs sm:text-sm">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-extrabold text-white text-sm sm:text-base">
                              {completedRoles.length >= REQUIRED_ROLES_COUNT
                                ? '🎉 3 OF 3 ASSIGNED ROLE ASSESSMENTS COMPLETE!'
                                : `ROLE ASSESSMENT COMPLETE (${completedRoles.length} OF ${REQUIRED_ROLES_COUNT} FINISHED)`}
                            </span>
                            <span className="px-2.5 py-0.5 rounded-full font-mono text-xs font-bold bg-amber-400 text-slate-950">
                              {completedRoles.length} / {REQUIRED_ROLES_COUNT} Roles
                            </span>
                          </div>

                          {completedRoles.length < REQUIRED_ROLES_COUNT ? (
                            <>
                              <p className="text-slate-200 leading-relaxed">
                                <strong>Advisory:</strong> You have completed <strong>{completedRoles.length} of {REQUIRED_ROLES_COUNT}</strong> required role assessments. To finish the drill and be able to download your official report, you must complete <strong>3 assigned role assessments</strong> (your choice).
                              </p>
                              <p className="text-amber-300 font-medium pt-1">
                                Please select your next role to continue the assessment program until 3 are completed.
                              </p>
                              <p className="text-slate-400 text-xs font-arabic pt-1 border-t border-slate-800">
                                توجيه للمتدرب: لقد أتممت {completedRoles.length} من أصل 3 تقييمات أدوار مطلوبة. للتمكن من إنهاء التدريب وتحميل التقرير الرسمي، يجب إتمام 3 تقييمات أدوار من اختيارك. يرجى اختيار دورك التالي.
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="text-emerald-300 font-semibold leading-relaxed">
                                Outstanding achievement! You have fulfilled the mandatory requirement of completing <strong>3 assigned role assessments</strong>.
                              </p>
                              <p className="text-slate-200">
                                You can now finalize your drill session, view the comprehensive 3-role performance debrief, and download your signed official assessment transcript.
                              </p>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Score Breakdown Bars */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-4">
                    <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                      Performance Breakdown
                    </h3>
                    <div className="space-y-3">
                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">1. Emergency Classification</span>
                          <span className="text-amber-400">{record.levelScore} / 30 Pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(record.levelScore / 30) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">2. Procedure Sequence</span>
                          <span className="text-amber-400">{record.sequenceScore} / 35 Pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(record.sequenceScore / 35) * 100}%` }}
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex justify-between text-xs font-semibold mb-1">
                          <span className="text-slate-300">3. Tactical Actions</span>
                          <span className="text-amber-400">{record.tacticalScore} / 35 Pts</span>
                        </div>
                        <div className="w-full bg-slate-950 rounded-full h-2 overflow-hidden border border-slate-800">
                          <div 
                            className="bg-amber-400 h-full rounded-full transition-all duration-500" 
                            style={{ width: `${(record.tacticalScore / 35) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* What Was Done Correctly */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider">
                      <CheckCircle2 className="w-4 h-4" />
                      <span>What Did You Do Correctly / الإجراءات الصحيحة</span>
                    </div>
                    <div className="space-y-2">
                      {record.correctFeedback.map((item, idx) => (
                        <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                          <span className="text-emerald-400 font-bold shrink-0">✓</span>
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* What Can Be Improved */}
                  <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 space-y-3">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                      <AlertTriangle className="w-4 h-4" />
                      <span>What Can Be Improved / نقاط التحسين الموصى بها</span>
                    </div>
                    {record.improvementFeedback.length > 0 ? (
                      <div className="space-y-2">
                        {record.improvementFeedback.map((item, idx) => (
                          <div key={idx} className="flex items-start gap-2 text-xs text-slate-300 p-2.5 rounded-xl bg-slate-950/70 border border-slate-800/80">
                            <span className="text-amber-400 font-bold shrink-0">!</span>
                            <span>{item}</span>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-slate-400 italic p-3 bg-slate-950 rounded-xl">
                        No errors identified. Standard operational protocol was executed with 100% adherence.
                      </p>
                    )}
                  </div>

                  {/* Navigation Actions (Enforcing 3-Role Assessment flow) */}
                  <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                    <button
                      type="button"
                      onClick={() => initScenarioBrief(activeDrillIndex)}
                      className="w-full sm:w-1/3 py-3.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
                    >
                      <RotateCcw className="w-4 h-4" />
                      <span>Retry Drill {activeDrillIndex + 1}</span>
                    </button>

                    {isDrill1 ? (
                      <button
                        type="button"
                        onClick={() => initScenarioBrief(1)}
                        className="w-full sm:w-2/3 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-[0.99]"
                      >
                        <span>Proceed to Drill 2 for {activeRole.titleEn}</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    ) : completedRoles.length < REQUIRED_ROLES_COUNT ? (
                      <button
                        type="button"
                        onClick={handleSelectNextRole}
                        className="w-full sm:w-2/3 py-3.5 px-4 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-amber-400/20 transition-transform active:scale-[0.99]"
                      >
                        <span>Select Next Role ({completedRoles.length + 1} of 3) / اختيار الدور التالي</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={() => setStage('FULL_REPORT')}
                        className="w-full sm:w-2/3 py-3.5 px-4 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 font-black text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-400/20 transition-transform active:scale-[0.99]"
                      >
                        <span>View Full 3-Role Report & Download PDF</span>
                        <ChevronRight className="w-4 h-4 stroke-[2.5]" />
                      </button>
                    )}
                  </div>
                </>
              );
            })()}
          </div>
        )}

        {/* 7. FULL 3-ROLE MASTER ASSESSMENT REPORT SCREEN */}
        {stage === 'FULL_REPORT' && (
          <div className="space-y-6 animate-in fade-in duration-300">
            {/* Top Qualification Banner */}
            <div className={`p-6 sm:p-7 rounded-2xl border text-center space-y-2 shadow-2xl ${
              masterStats && masterStats.avgScore >= 70
                ? 'bg-gradient-to-b from-emerald-950/60 to-slate-900 border-emerald-500/60'
                : 'bg-gradient-to-b from-amber-950/60 to-slate-900 border-amber-500/60'
            }`}>
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-slate-900 border-2 border-amber-400 text-amber-400 shadow-lg shadow-amber-400/20 mb-1">
                <Award className="w-7 h-7" />
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {masterStats && masterStats.avgScore >= 70
                  ? '3-ROLE ERT READINESS CERTIFIED'
                  : '3-ROLE DRILL COMPLETED · FURTHER PRACTICE RECOMMENDED'}
              </h2>
              <div className="text-xs text-slate-400">
                King Salman International Airport · Emergency Response Team (ERT) Master Assessment
              </div>
              <div className="text-4xl sm:text-5xl font-black text-white font-mono pt-2">
                {masterStats?.avgScore || 0} <span className="text-sm font-normal text-slate-400">/ 100 CUMULATIVE AVG</span>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-3 text-xs text-slate-300 pt-1">
                <span>Completed Roles: {completedRoles.length} of {REQUIRED_ROLES_COUNT}</span>
                <span>·</span>
                <span>Total Response Time: {formatMinSec(masterStats?.totalTime || 0)}</span>
                <span>·</span>
                <span>Qualification: {masterStats && masterStats.avgScore >= 70 ? 'PASS' : 'REMEDIAL'}</span>
              </div>
            </div>

            {/* Candidate Metadata Summary */}
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3 text-xs">
              <div>
                <span className="text-slate-400 block text-[11px]">Candidate Name</span>
                <span className="text-white font-bold text-sm">{profile.fullName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Employee ID</span>
                <span className="text-slate-200 font-mono font-medium">{profile.employeeId}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Assessment Date</span>
                <span className="text-slate-200 font-medium">{profile.assessmentDate}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[11px]">Requirement Check</span>
                <span className="text-emerald-400 font-mono font-bold">3 of 3 Roles Fulfilled ✓</span>
              </div>
            </div>

            {/* CRITICAL USER REQUIREMENT: Bleeping / Pulsing Yellow Download Report Button */}
            <div className="py-2">
              <button
                type="button"
                onClick={exportPDF}
                className="relative group w-full py-4 px-6 rounded-2xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-base flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(250,204,21,0.5)] ring-4 ring-amber-400/50 animate-pulse transition-transform active:scale-[0.98]"
              >
                {/* Visual Radar / Bleep Ping */}
                <span className="relative flex h-3.5 w-3.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-slate-950 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-slate-950"></span>
                </span>
                <Download className="w-5 h-5 stroke-[2.5]" />
                <span className="tracking-wide">DOWNLOAD 3-ROLE ASSESSMENT REPORT (PDF)</span>
              </button>
              <p className="text-center text-[11px] text-slate-400 mt-2">
                Generates official certified King Salman International Airport ERT transcript containing all 3 evaluated roles and 6 drill debriefs.
              </p>
            </div>

            {/* FULL REVIEW OF ALL 3 COMPLETED ROLES */}
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <BadgeCheck className="w-4 h-4 text-amber-400" />
                  <span>3-Role Tactical Performance Record</span>
                </h3>
                <span className="text-xs text-slate-400">
                  {completedRoles.length} Roles · 6 Tactical Drills
                </span>
              </div>

              {completedRoles.map((roleRecord, roleIdx) => {
                const theme = getRoleTheme(roleRecord.roleId);
                return (
                  <div
                    key={roleRecord.roleId}
                    className="bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 space-y-5 shadow-xl"
                  >
                    {/* Role Header Banner with Primary Color */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
                      <div className="flex items-center gap-3">
                        <div className={`p-2.5 rounded-xl shrink-0 ${theme.iconBgClass}`}>
                          {renderRoleIcon(roleRecord.roleId, 'w-6 h-6')}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-400">
                              Role {roleIdx + 1} of 3
                            </span>
                            <span className={`text-[10px] font-mono px-1.5 py-0.2 rounded font-bold ${theme.badgeBgClass} ${theme.badgeTextClass}`}>
                              {roleRecord.role.code}
                            </span>
                          </div>
                          <h4 className="text-base sm:text-lg font-bold text-white">
                            {roleRecord.role.titleEn}
                          </h4>
                          <p className="text-xs text-slate-400">{roleRecord.role.titleAr}</p>
                        </div>
                      </div>

                      <div className="sm:text-right shrink-0 bg-slate-950/60 px-4 py-2 rounded-xl border border-slate-800">
                        <div className="text-xs text-slate-400">Role Average</div>
                        <div className="text-xl sm:text-2xl font-black text-white font-mono">
                          {roleRecord.averageScore} <span className="text-xs font-normal text-slate-400">/ 100</span>
                        </div>
                        <div className="text-[11px] text-slate-400">
                          Total Time: {formatMinSec(roleRecord.totalTime)}
                        </div>
                      </div>
                    </div>

                    {/* Both Drills for this Role */}
                    <div className="space-y-4">
                      {roleRecord.drills.map((drillRec, dIdx) => (
                        <div
                          key={dIdx}
                          className="bg-slate-950/80 border border-slate-800/80 rounded-xl p-4 space-y-3"
                        >
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-slate-850 pb-2">
                            <div>
                              <div className="text-[11px] font-semibold text-amber-400">
                                Drill {dIdx + 1}: {drillRec.scenario.titleEn}
                              </div>
                              <div className="text-[11px] text-slate-400">
                                Emergency Level: {drillRec.selectedLevel} (Standard: {drillRec.scenario.correctLevel})
                              </div>
                            </div>
                            <div className="font-mono text-sm font-bold text-white">
                              {drillRec.totalScore} / 100 <span className="text-xs font-normal text-slate-500">({formatMinSec(drillRec.elapsedSeconds)})</span>
                            </div>
                          </div>

                          {/* Correct Feedback */}
                          <div className="space-y-1">
                            <span className="text-[11px] font-bold text-emerald-400 block">
                              ✓ Verified Tactical Actions:
                            </span>
                            {drillRec.correctFeedback.slice(0, 2).map((item, i) => (
                              <p key={i} className="text-xs text-slate-300 pl-2 border-l border-emerald-500/40">
                                {item}
                              </p>
                            ))}
                          </div>

                          {/* Improvements */}
                          {drillRec.improvementFeedback.length > 0 && (
                            <div className="space-y-1 pt-1">
                              <span className="text-[11px] font-bold text-amber-400 block">
                                ! Recommended Adjustments:
                              </span>
                              {drillRec.improvementFeedback.slice(0, 2).map((item, i) => (
                                <p key={i} className="text-xs text-slate-400 pl-2 border-l border-amber-500/40">
                                  {item}
                                </p>
                              ))}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Bottom Controls */}
            <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
              <button
                type="button"
                onClick={() => setStage('REGISTRATION')}
                className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <Compass className="w-4 h-4" />
                <span>Return to Role Selection / تبديل الأدوار</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  if (confirm('Start a new assessment session? All completed role records will be cleared for a new candidate.')) {
                    setCompletedRoles([]);
                    setCurrentRoleDrillRecords([null, null]);
                    setStage('REGISTRATION');
                  }
                }}
                className="w-full sm:w-1/2 py-3.5 px-4 rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 transition-colors"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Start New Candidate Assessment</span>
              </button>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 py-4 px-4 text-center text-xs text-slate-500">
        <p>King Salman International Airport (KSIA) · Emergency Response Team Training Platform</p>
      </footer>
    </div>
  );
}
