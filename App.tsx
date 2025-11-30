import React, { useState, useEffect } from "react";
import {
  SafeAreaView,
  Text,
  TextInput,
  View,
  ScrollView,
  Pressable,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { API_BASE } from "./api";

type Screen = "login" | "signup" | "profile";
type MessageType = "success" | "error" | "info" | null;

const COLORS = {
  bg: "#020617",
  cardBg: "rgba(15, 23, 42, 0.94)",
  cardBorder: "rgba(148, 163, 184, 0.7)",
  textPrimary: "#e5e7eb",
  textSecondary: "#9ca3af",
  accent: "#6366f1",
};

export default function App() {
  const [screen, setScreen] = useState<Screen>("login");

  // Auth forms
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  // Auth state
  const [token, setToken] = useState<string | null>(null);
  const [profile, setProfile] = useState<any>(null);

  // Feedback
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState<MessageType>(null);

  // Profile editing state
  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [editName, setEditName] = useState("");
  const [editBio, setEditBio] = useState("");

  // Profile strength meter
  const [profileScore, setProfileScore] = useState(0);

  // Animation for screen content
  const [contentOpacity] = useState(new Animated.Value(0));
  const [contentTranslate] = useState(new Animated.Value(10));

  const animateScreen = () => {
    contentOpacity.setValue(0);
    contentTranslate.setValue(10);
    Animated.parallel([
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 220,
        useNativeDriver: true,
      }),
      Animated.timing(contentTranslate, {
        toValue: 0,
        duration: 220,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const setFeedback = (msg: string, type: MessageType) => {
    setMessage(msg);
    setMessageType(type);
  };

  const resetAuthForm = () => {
    setEmail("");
    setPassword("");
    setName("");
  };

  // Restore session on mount
  useEffect(() => {
    const restoreSession = async () => {
      try {
        const stored = await AsyncStorage.getItem("token");
        if (!stored) return;

        setToken(stored);
        const ok = await loadProfile(stored, true);
        if (ok) setScreen("profile");
      } catch (err) {
        console.log("Error restoring token", err);
      }
    };
    restoreSession();
  }, []);

  // Profile strength
  useEffect(() => {
    setProfileScore(computeProfileStrength(editName, editBio));
  }, [editName, editBio]);

  // Re-animate on tab change
  useEffect(() => {
    animateScreen();
  }, [screen]);

  const handleSignup = async () => {
    setFeedback("Signing up...", "info");

    try {
      const res = await fetch(`${API_BASE}/auth/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log("Signup response:", res.status, data);

      if (!res.ok) {
        if (res.status === 400 && data.detail) {
          setFeedback(String(data.detail), "error");
        } else if (res.status === 422) {
          setFeedback("Please check the fields and try again.", "error");
        } else {
          setFeedback("Signup failed. Please try again.", "error");
        }
        return;
      }

      setFeedback("Signup success! Switch to Login tab.", "success");
      resetAuthForm();
      setScreen("login");
    } catch (err) {
      console.error("Signup error:", err);
      setFeedback(
        "Network error during signup. Please check your internet.",
        "error"
      );
    }
  };

  const handleLogin = async () => {
    setFeedback("Logging in...", "info");

    try {
      const body = new URLSearchParams({
        username: email,
        password,
      }).toString();

      const res = await fetch(`${API_BASE}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body,
      });

      const data = await res.json();
      console.log("Login response:", res.status, data);

      if (!res.ok || !data.access_token) {
        if (res.status === 400) {
          setFeedback("Invalid email or password.", "error");
        } else if (res.status === 422) {
          setFeedback("Please fill in email and password correctly.", "error");
        } else {
          setFeedback("Login failed. Please try again.", "error");
        }
        setPassword("");
        return;
      }

      setToken(data.access_token);
      await AsyncStorage.setItem("token", data.access_token);

      setFeedback("Login success! Profile loaded.", "success");
      await loadProfile(data.access_token);
      resetAuthForm();
      setScreen("profile");
    } catch (err) {
      console.error("Login error:", err);
      setFeedback(
        "Network error during login. Please check your internet.",
        "error"
      );
    }
  };

  // Returns true if profile loaded fine
  const loadProfile = async (
    authToken: string,
    silent = false
  ): Promise<boolean> => {
    try {
      const res = await fetch(`${API_BASE}/profile/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });

      const data = await res.json();
      console.log("Profile response:", res.status, data);

      if (!res.ok) {
        if (!silent) {
          setFeedback(
            data.detail || "Failed to load profile. Please try again.",
            "error"
          );
        }
        return false;
      }

      setProfile(data);
      setEditName(data.name || "");
      setEditBio(data.bio || "");
      return true;
    } catch (err) {
      console.error("Profile error:", err);
      if (!silent) {
        setFeedback(
          "Network error while loading profile. Please check your internet.",
          "error"
        );
      }
      return false;
    }
  };

  const handleUpdateProfile = async () => {
    if (!token) {
      setFeedback("You must be logged in to update profile.", "error");
      return;
    }

    setFeedback("Updating profile...", "info");

    try {
      const res = await fetch(`${API_BASE}/profile/me`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ name: editName, bio: editBio }),
      });

      const data = await res.json();
      console.log("Update profile response:", res.status, data);

      if (!res.ok) {
        setFeedback(
          data.detail || "Failed to update profile. Please try again.",
          "error"
        );
        return;
      }

      setProfile(data);
      setIsEditingProfile(false);
      setFeedback("Profile updated successfully.", "success");
    } catch (err) {
      console.error("Update profile error:", err);
      setFeedback(
        "Network error while updating profile. Please check your internet.",
        "error"
      );
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem("token");
    } catch (err) {
      console.log("Error removing token", err);
    }
    setToken(null);
    setProfile(null);
    setIsEditingProfile(false);
    resetAuthForm();
    setFeedback("Logged out.", "info");
    setScreen("login");
  };

  const profileInitial =
    profile?.name && typeof profile.name === "string"
      ? profile.name.trim().charAt(0).toUpperCase()
      : "U";

  // Message colors mapped by type
  const msgStyles = {
    success: {
      bg: "#dcfce7",
      border: "#86efac",
      text: "#166534",
    },
    error: {
      bg: "#fee2e2",
      border: "#fca5a5",
      text: "#b91c1c",
    },
    info: {
      bg: "#e0f2fe",
      border: "#7dd3fc",
      text: "#0369a1",
    },
    default: {
      bg: "#e0f2fe",
      border: "#60a5fa",
      text: "#1d4ed8",
    },
  };

  const { bg: msgBg, border: msgBorder, text: msgText } =
    msgStyles[messageType || "default"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.bg }}>
      <View style={{ flex: 1, paddingHorizontal: 16, paddingVertical: 24 }}>
        {/* Decorative background blobs */}
        <View
          style={{
            position: "absolute",
            width: 260,
            height: 260,
            borderRadius: 999,
            backgroundColor: "rgba(96, 165, 250, 0.35)",
            top: -80,
            left: -60,
            transform: [{ rotate: "-12deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 220,
            height: 220,
            borderRadius: 999,
            backgroundColor: "rgba(244, 114, 182, 0.30)",
            top: -40,
            right: -40,
            transform: [{ rotate: "18deg" }],
          }}
        />
        <View
          style={{
            position: "absolute",
            width: 320,
            height: 320,
            borderRadius: 999,
            backgroundColor: "rgba(34, 197, 94, 0.25)",
            bottom: -120,
            right: -60,
            transform: [{ rotate: "-8deg" }],
          }}
        />

        <ScrollView
          contentContainerStyle={{
            flexGrow: 1,
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {/* App Title */}
          <Text
            style={{
              fontSize: 30,
              color: "#e2e8f0",
              marginBottom: 6,
              letterSpacing: 1,
              textShadowColor: "rgba(0,0,0,0.6)",
              textShadowOffset: { width: 0, height: 2 },
              textShadowRadius: 6,
              fontWeight: "800",
              textAlign: "center",
            }}
          >
            Profile Management System
          </Text>

          {/* Subtitle */}
          <Text
            style={{
              fontSize: 13,
              color: "#94a3b8",
              marginBottom: 20,
              fontWeight: "500",
              textAlign: "center",
            }}
          >
            Secure • Modern • Cross-Platform
          </Text>

          {/* CARD */}
          <View
            style={{
              width: "100%",
              maxWidth: 480,
              borderRadius: 28,
              padding: 24,
              backgroundColor: COLORS.cardBg,
              borderWidth: 1,
              borderColor: COLORS.cardBorder,
              shadowColor: "#000",
              shadowOpacity: 0.35,
              shadowRadius: 30,
              shadowOffset: { width: 0, height: 18 },
              elevation: 12,
            }}
          >
            {/* Header inside card */}
            <View style={{ marginBottom: 16 }}>
              <Text
                style={{
                  color: COLORS.textPrimary,
                  fontSize: 24,
                  fontWeight: "700",
                  marginBottom: 4,
                }}
              >
                Welcome back
              </Text>
              <Text style={{ color: COLORS.textSecondary, fontSize: 13 }}>
                Sign up, log in, and edit your profile.
              </Text>
            </View>

            {/* Tabs */}
            <View
              style={{
                flexDirection: "row",
                backgroundColor: "rgba(15,23,42,0.9)",
                borderRadius: 999,
                padding: 4,
                marginBottom: 14,
                borderWidth: 1,
                borderColor: "rgba(75,85,99,0.9)",
              }}
            >
              <Tab
                label="Login"
                active={screen === "login"}
                onPress={() => {
                  resetAuthForm();
                  setScreen("login");
                  setFeedback("", null);
                }}
              />
              <Tab
                label="Sign Up"
                active={screen === "signup"}
                onPress={() => {
                  resetAuthForm();
                  setScreen("signup");
                  setFeedback("", null);
                }}
              />
              <Tab
                label="Profile"
                active={screen === "profile"}
                onPress={() => {
                  setScreen("profile");
                  setFeedback("", null);
                  if (token && !profile) loadProfile(token);
                }}
              />
            </View>

            {/* Message / toast banner */}
            {!!message && (
              <View
                style={{
                  backgroundColor: msgBg,
                  borderRadius: 10,
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  marginBottom: 12,
                  borderWidth: 1,
                  borderColor: msgBorder,
                }}
              >
                <Text style={{ color: msgText, fontSize: 12 }}>{message}</Text>
              </View>
            )}

            {/* Animated content */}
            <Animated.View
              style={{
                opacity: contentOpacity,
                transform: [{ translateY: contentTranslate }],
              }}
            >
              {/* LOGIN */}
              {screen === "login" && (
                <View>
                  <Input
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="Enter your e-mail"
                  />
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="******"
                  />

                  <Button label="Log in" onPress={handleLogin} />

                  <View
                    style={{
                      marginTop: 14,
                      flexDirection: "row",
                      justifyContent: "center",
                    }}
                  >
                    <Text style={{ color: COLORS.textSecondary, fontSize: 12 }}>
                      Don&apos;t have an account?{" "}
                    </Text>
                    <Pressable
                      onPress={() => {
                        resetAuthForm();
                        setScreen("signup");
                        setFeedback("", null);
                      }}
                    >
                      <Text
                        style={{
                          color: "#a5b4fc",
                          fontSize: 12,
                          fontWeight: "600",
                        }}
                      >
                        Register here
                      </Text>
                    </Pressable>
                  </View>
                </View>
              )}

              {/* SIGNUP */}
              {screen === "signup" && (
                <View>
                  <Input
                    label="Name"
                    value={name}
                    onChangeText={setName}
                    placeholder="Your name"
                  />
                  <Input
                    label="E-mail"
                    value={email}
                    onChangeText={setEmail}
                    placeholder="you@example.com"
                  />
                  <Input
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    placeholder="******"
                  />
                  <Button label="Sign up" onPress={handleSignup} />
                </View>
              )}

              {/* PROFILE */}
              {screen === "profile" && (
                <View>
                  {!token && (
                    <Text
                      style={{
                        color: COLORS.textSecondary,
                        marginBottom: 8,
                        fontSize: 12,
                      }}
                    >
                      Please log in first to load your profile.
                    </Text>
                  )}

                  {profile && !isEditingProfile && (
                    <View>
                      <View
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          marginBottom: 12,
                        }}
                      >
                        <View
                          style={{
                            width: 48,
                            height: 48,
                            borderRadius: 999,
                            backgroundColor: COLORS.accent,
                            alignItems: "center",
                            justifyContent: "center",
                            marginRight: 12,
                          }}
                        >
                          <Text
                            style={{
                              color: "white",
                              fontSize: 22,
                              fontWeight: "700",
                            }}
                          >
                            {profileInitial}
                          </Text>
                        </View>
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: COLORS.textPrimary,
                              fontSize: 16,
                              fontWeight: "600",
                            }}
                          >
                            {profile.name || "No name set"}
                          </Text>
                          <Text
                            style={{
                              color: COLORS.textSecondary,
                              fontSize: 12,
                            }}
                          >
                            {profile.email}
                          </Text>
                        </View>
                      </View>

                      <Text
                        style={{
                          color: COLORS.textSecondary,
                          fontSize: 12,
                          marginBottom: 4,
                        }}
                      >
                        Bio
                      </Text>
                      <Text
                        style={{
                          color: COLORS.textPrimary,
                          fontSize: 13,
                          marginBottom: 12,
                        }}
                      >
                        {profile.bio || "No bio added yet."}
                      </Text>

                      <Button
                        label="Edit profile"
                        onPress={() => {
                          setEditName(profile.name || "");
                          setEditBio(profile.bio || "");
                          setIsEditingProfile(true);
                          setFeedback("", null);
                        }}
                      />
                      <Button label="Log out" onPress={handleLogout} />
                    </View>
                  )}

                  {profile && isEditingProfile && (
                    <View>
                      <ProfileStrengthBar score={profileScore} />

                      <Input
                        label="Name"
                        value={editName}
                        onChangeText={setEditName}
                        placeholder="Your name"
                      />
                      <Input
                        label="Bio"
                        value={editBio}
                        onChangeText={setEditBio}
                        placeholder="Tell something about yourself"
                      />
                      <Button
                        label="Save changes"
                        onPress={handleUpdateProfile}
                      />
                      <Button
                        label="Cancel"
                        onPress={() => {
                          setIsEditingProfile(false);
                          setFeedback("Edit cancelled.", "info");
                        }}
                      />
                    </View>
                  )}

                  {token && !profile && (
                    <Text
                      style={{
                        color: COLORS.textSecondary,
                        marginTop: 8,
                        fontSize: 12,
                      }}
                    >
                      No profile loaded yet.
                    </Text>
                  )}
                </View>
              )}
            </Animated.View>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

/* ---------- Small components ---------- */

type TabProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function Tab({ label, active, onPress }: TabProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        flex: 1,
        paddingVertical: 8,
        borderRadius: 999,
        alignItems: "center",
        backgroundColor: active ? "#111827" : "transparent",
        transform: [{ scale: pressed ? 0.97 : 1 }],
        opacity: pressed ? 0.85 : 1,
      })}
    >
      <Text
        style={{
          color: active ? "#e5e7eb" : "#9ca3af",
          fontSize: 13,
          fontWeight: active ? "600" : "500",
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

type InputProps = {
  label: string;
  value: string;
  placeholder?: string;
  secureTextEntry?: boolean;
  onChangeText: (text: string) => void;
};

function Input({
  label,
  value,
  placeholder,
  secureTextEntry,
  onChangeText,
}: InputProps) {
  return (
    <View style={{ marginBottom: 12 }}>
      <Text
        style={{
          color: "#9ca3af",
          marginBottom: 4,
          fontSize: 12,
        }}
      >
        {label}
      </Text>
      <TextInput
        placeholder={placeholder}
        placeholderTextColor="#6b7280"
        secureTextEntry={secureTextEntry}
        value={value}
        onChangeText={onChangeText}
        style={{
          backgroundColor: "#020617",
          color: "#e5e7eb",
          paddingHorizontal: 12,
          paddingVertical: 10,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: "#1f2937",
          fontSize: 13,
        }}
      />
    </View>
  );
}

type ButtonProps = {
  label: string;
  onPress: () => void;
};

function Button({ label, onPress }: ButtonProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => ({
        backgroundColor: pressed ? "#4f46e5" : "#6366f1",
        paddingVertical: 11,
        borderRadius: 999,
        marginTop: 10,
        alignItems: "center",
        transform: [{ scale: pressed ? 0.97 : 1 }],
        shadowColor: "#4f46e5",
        shadowOpacity: pressed ? 0.4 : 0.25,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 4 },
        elevation: 4,
      })}
    >
      <Text
        style={{
          color: "#ffffff",
          fontWeight: "600",
          fontSize: 14,
        }}
      >
        {label}
      </Text>
    </Pressable>
  );
}

/* ---- Helper functions for bonus meter ---- */

function computeProfileStrength(name: string, bio: string): number {
  let score = 0;
  const cleanName = name.trim();
  const cleanBio = bio.trim();

  if (cleanName.length > 0) score += 25;
  if (cleanName.length >= 3) score += 10;

  if (cleanBio.length > 0) score += 25;
  if (cleanBio.length >= 30) score += 20;
  if (cleanBio.length >= 80) score += 20;

  return Math.min(score, 100);
}

function getStrengthMeta(score: number) {
  if (score < 40) return { label: "Weak", color: "#ef4444" };
  if (score < 75) return { label: "Good", color: "#f59e0b" };
  return { label: "Excellent", color: "#16a34a" };
}

function ProfileStrengthBar({ score }: { score: number }) {
  const { label, color } = getStrengthMeta(score);

  return (
    <View style={{ marginBottom: 12 }}>
      <Text style={{ color: "#9ca3af", fontSize: 12, marginBottom: 4 }}>
        Profile strength
      </Text>
      <View
        style={{
          height: 8,
          borderRadius: 999,
          backgroundColor: "#1f2937",
          overflow: "hidden",
          marginBottom: 4,
        }}
      >
        <View
          style={{
            height: "100%",
            width: `${score}%`,
            backgroundColor: color,
          }}
        />
      </View>
      <Text style={{ fontSize: 11, color, fontWeight: "600" }}>
        {label} • {score}%
      </Text>
    </View>
  );
}