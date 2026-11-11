import React, { useState, useEffect } from 'react';
import {
  googleSignIn,
  logout,
  getAccessToken,
  fetchGoogleChatSpaces,
  broadcastToGoogleChat,
  GoogleChatSpace,
} from '../utils/firebaseAuth';
import { Disaster, AllocationPlan } from '../types';
import { User } from 'firebase/auth';
import {
  MessageSquare,
  X,
  Send,
  AlertTriangle,
  CheckCircle2,
  RefreshCw,
  LogOut,
  Radio,
  Shield,
  ExternalLink,
} from 'lucide-react';

interface GoogleChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  disaster: Disaster;
  allocationPlan: AllocationPlan | null;
  currentUser: User | null;
  token: string | null;
  onAuthChange: (user: User | null, token: string | null) => void;
}

export const GoogleChatModal: React.FC<GoogleChatModalProps> = ({
  isOpen,
  onClose,
  disaster,
  allocationPlan,
  currentUser,
  token,
  onAuthChange,
}) => {
  const [spaces, setSpaces] = useState<GoogleChatSpace[]>([]);
  const [selectedSpace, setSelectedSpace] = useState<string>('');
  const [customSpaceInput, setCustomSpaceInput] = useState<string>('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [sendResult, setSendResult] = useState<{ success: boolean; message: string } | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);

  useEffect(() => {
    if (token) {
      fetchGoogleChatSpaces(token).then((data) => {
        setSpaces(data);
        if (data.length > 0) {
          setSelectedSpace(data[0].name);
        }
      });
    }
  }, [token]);

  if (!isOpen) return null;

  const handleSignIn = async () => {
    setIsLoggingIn(true);
    setSendResult(null);
    try {
      const res = await googleSignIn();
      if (res) {
        onAuthChange(res.user, res.accessToken);
      }
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setSendResult({
        success: false,
        message: err.message || 'Google Sign-In failed or popup was closed.',
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleSignOut = async () => {
    await logout();
    onAuthChange(null, null);
    setSpaces([]);
    setSelectedSpace('');
  };

  const activeSpace = selectedSpace || customSpaceInput;

  const generateBulletinText = () => {
    const allocCount = allocationPlan ? allocationPlan.totalAllocated.toLocaleString() : 'Pending';
    const unallocCount = allocationPlan ? allocationPlan.unallocatedCount.toLocaleString() : '0';
    const topShelters = allocationPlan
      ? allocationPlan.allocations
          .slice(0, 3)
          .map((a) => `• ${a.shelterName}: ${a.allocatedCount.toLocaleString()} evacuees (${a.distanceKm}km, ETA: ${a.etaMinutes}m)`)
          .join('\n')
      : '• Calculating optimal shelter allocation...';

    return `🚨 [EMERGENCY ACTION BULLETIN] ShelterOps AI National Command
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
HAZARD: ${disaster.name} (${disaster.type.toUpperCase()})
SEVERITY: ${disaster.severity.toUpperCase()} ALERT
LOCATION: ${disaster.location.district}, ${disaster.location.state}
AFFECTED CITIZENS: ${disaster.affectedPopulation.toLocaleString()}
EXCLUSION PERIMETER: ${disaster.exclusionRadiusKm} km Mandatory Buffer

🛡️ SMART SHELTER ALLOCATION STATUS:
• Successfully Allocated: ${allocCount} citizens
• Pending Capacity Buffer: ${unallocCount} citizens
• Assigned Regional Hubs:
${topShelters}

⚠️ LOGISTICS INSTRUCTION:
Primary evacuation corridor via Elevated SH-715A open. Submerged NH-37 connector BLOCKED. All emergency convoys proceed under SDRF escort.
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Timestamp: ${new Date().toISOString()} • ShelterOps AI`;
  };

  // Step 1: Trigger confirmation modal (Mandatory for destructive/external operations)
  const handleInitiateSend = () => {
    if (!activeSpace) {
      setSendResult({ success: false, message: 'Please select or enter a target Google Chat Space.' });
      return;
    }
    setShowConfirmDialog(true);
  };

  // Step 2: Confirmed by user
  const handleConfirmedSend = async () => {
    setShowConfirmDialog(false);
    setIsSending(true);
    setSendResult(null);

    const message = generateBulletinText();
    const result = await broadcastToGoogleChat(token!, activeSpace, message);

    if (result.success) {
      setSendResult({
        success: true,
        message: `Emergency bulletin successfully dispatched to Google Chat (${activeSpace})!`,
      });
    } else {
      setSendResult({
        success: false,
        message: result.error || 'Failed to dispatch message to Google Chat.',
      });
    }
    setIsSending(false);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-950/60">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-emerald-500/20 text-emerald-400">
              <MessageSquare className="w-5 h-5" />
            </span>
            <div>
              <h3 className="text-base font-bold text-white">Google Chat Emergency Dispatch</h3>
              <p className="text-[11px] text-slate-400">
                Broadcast real-time disaster alerts & shelter allocation reports to your emergency spaces.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1 text-xs">
          {/* Auth State */}
          {!currentUser ? (
            <div className="bg-slate-800/80 border border-slate-700 p-5 rounded-xl text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center mx-auto">
                <Shield className="w-6 h-6" />
              </div>
              <h4 className="text-sm font-bold text-white">Connect Google Workspace Account</h4>
              <p className="text-slate-400 text-xs max-w-sm mx-auto">
                Sign in with your Google account to list your Google Chat spaces and dispatch live emergency updates to your response teams.
              </p>

              {/* Official Google Sign-In Button */}
              <div className="pt-2 flex justify-center">
                <button
                  onClick={handleSignIn}
                  disabled={isLoggingIn}
                  className="px-5 py-2.5 bg-white hover:bg-slate-100 text-slate-800 font-semibold text-xs rounded-xl shadow flex items-center gap-3 transition-all cursor-pointer disabled:opacity-60"
                >
                  <svg className="w-4 h-4" viewBox="0 0 48 48">
                    <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                    <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                    <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
                    <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                  </svg>
                  <span>{isLoggingIn ? 'Connecting...' : 'Sign in with Google'}</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Connected User Pill */}
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-800/80 border border-slate-700">
                <div className="flex items-center gap-2.5">
                  {currentUser.photoURL ? (
                    <img src={currentUser.photoURL} alt="User" className="w-8 h-8 rounded-full border border-slate-600" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-emerald-600 flex items-center justify-center font-bold text-white text-xs">
                      {currentUser.displayName?.[0] || 'U'}
                    </div>
                  )}
                  <div>
                    <span className="font-bold text-white text-xs block">{currentUser.displayName || 'Authorized Responder'}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{currentUser.email}</span>
                  </div>
                </div>

                <button
                  onClick={handleSignOut}
                  className="px-2.5 py-1 text-[11px] text-slate-400 hover:text-red-300 rounded hover:bg-slate-700/50 flex items-center gap-1 transition-colors"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </button>
              </div>

              {/* Space Selection */}
              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Target Google Chat Space
                </label>
                {spaces.length > 0 ? (
                  <select
                    className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-xs text-white focus:outline-none focus:border-emerald-500"
                    value={selectedSpace}
                    onChange={(e) => setSelectedSpace(e.target.value)}
                  >
                    {spaces.map((sp) => (
                      <option key={sp.name} value={sp.name}>
                        {sp.displayName || sp.name} ({sp.spaceType || 'Space'})
                      </option>
                    ))}
                  </select>
                ) : (
                  <div className="space-y-1.5">
                    <input
                      type="text"
                      placeholder="Enter Google Chat Space Resource (e.g. spaces/AAAAAAAAAAA)..."
                      value={customSpaceInput}
                      onChange={(e) => setCustomSpaceInput(e.target.value)}
                      className="w-full bg-slate-800 border border-slate-700 p-2.5 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                    />
                    <span className="text-[10px] text-slate-400 block">
                      Tip: Enter the resource ID of your team&apos;s Google Chat room.
                    </span>
                  </div>
                )}
              </div>

              {/* Message Bulletin Preview */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                  Bulletin Message Preview
                </span>
                <pre className="p-3 bg-slate-950 border border-slate-800 rounded-xl text-[11px] font-mono text-emerald-300 whitespace-pre-wrap max-h-48 overflow-y-auto leading-relaxed">
                  {generateBulletinText()}
                </pre>
              </div>
            </div>
          )}

          {/* Feedback messages */}
          {sendResult && (
            <div
              className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                sendResult.success
                  ? 'bg-emerald-950/60 border-emerald-700 text-emerald-300'
                  : 'bg-red-950/60 border-red-700 text-red-300'
              }`}
            >
              {sendResult.success ? <CheckCircle2 className="w-4 h-4 shrink-0" /> : <AlertTriangle className="w-4 h-4 shrink-0" />}
              <span>{sendResult.message}</span>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        {currentUser && (
          <div className="p-4 border-t border-slate-800 bg-slate-950/60 flex items-center justify-between gap-3">
            <span className="text-[11px] text-slate-500">
              Requires confirmation before posting externally.
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleInitiateSend}
                disabled={isSending || !activeSpace}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold text-xs rounded-xl shadow-lg shadow-emerald-500/25 flex items-center gap-1.5 transition-all cursor-pointer disabled:opacity-50"
              >
                <Send className={`w-3.5 h-3.5 ${isSending ? 'animate-spin' : ''}`} />
                <span>{isSending ? 'Sending Dispatch...' : 'Dispatch Alert to Chat'}</span>
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Mandatory User Confirmation Modal for Destructive/Mutating Operations */}
      {showConfirmDialog && (
        <div className="fixed inset-0 z-60 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="bg-slate-900 border border-amber-600/70 rounded-2xl w-full max-w-md p-5 shadow-2xl space-y-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-white">Confirm External Dispatch</h4>
                <p className="text-[11px] text-slate-400">Google Chat External Message Broadcast</p>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              Are you sure you want to broadcast this disaster action bulletin to the Google Chat space{' '}
              <strong className="text-amber-300 font-mono">{activeSpace}</strong>?
              This will notify all members of that space with the real-time hazard status and shelter allocation plan.
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2 border-t border-slate-800">
              <button
                onClick={() => setShowConfirmDialog(false)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs rounded-xl transition-colors cursor-pointer"
              >
                Abort / Cancel
              </button>
              <button
                onClick={handleConfirmedSend}
                className="px-4 py-2 bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs rounded-xl shadow-lg shadow-amber-500/25 transition-all cursor-pointer"
              >
                Yes, Dispatch Bulletin
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
