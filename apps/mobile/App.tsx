// apps/mobile/App.tsx
// Complete React Native mobile app for Veritas
// Works on iOS and Android with native performance

import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  SafeAreaView,
  ActivityIndicator,
  Alert,
  Platform,
  StatusBar,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Navigation Setup
const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

// ============ SCREENS ============

// Auth Screen
function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) throw new Error('Login failed');

      const data = await response.json();
      await AsyncStorage.setItem('veritas_token', data.token);
      navigation.replace('MainApp');
    } catch (error) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>🛡️ Veritas</Text>
          <Text style={styles.subtitle}>Web3 Marketplace</Text>
        </View>

        <View style={styles.form}>
          <Text style={styles.label}>Email</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="mail" size={20} color="#06b6d4" />
            <TextInput
              style={styles.input}
              placeholder="your@email.com"
              placeholderTextColor="#888"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              editable={!loading}
            />
          </View>

          <Text style={styles.label}>Password</Text>
          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed" size={20} color="#06b6d4" />
            <TextInput
              style={styles.input}
              placeholder="••••••••"
              placeholderTextColor="#888"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!loading}
            />
          </View>

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleLogin}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Sign In</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity onPress={() => navigation.navigate('Signup')}>
            <Text style={styles.link}>Don't have an account? Sign up</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// Jobs Screen
function JobsScreen({ navigation }) {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('open');

  useEffect(() => {
    loadJobs();
  }, [filter]);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('veritas_token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/jobs?status=${filter}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setJobs(data.data || []);
    } catch (error) {
      Alert.alert('Error', 'Failed to load jobs');
    } finally {
      setLoading(false);
    }
  };

  const renderJobCard = ({ item }) => (
    <TouchableOpacity
      style={styles.jobCard}
      onPress={() => navigation.navigate('JobDetail', { id: item.job_id })}
    >
      <View style={styles.jobHeader}>
        <Text style={styles.jobTitle}>{item.title}</Text>
        <Text style={styles.jobBudget}>${item.budget}</Text>
      </View>

      <Text style={styles.jobDescription} numberOfLines={2}>
        {item.description}
      </Text>

      <View style={styles.jobFooter}>
        <View style={styles.skillsContainer}>
          {item.skills_required.slice(0, 2).map((skill, i) => (
            <Text key={i} style={styles.skillBadge}>
              {skill}
            </Text>
          ))}
        </View>
        <Text style={styles.jobMeta}>
          {item.applicants_count} applications
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>💼 Jobs</Text>
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setFilter(filter === 'open' ? 'all' : 'open')}
        >
          <Ionicons name="filter" size={20} color="#06b6d4" />
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : jobs.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No jobs available</Text>
        </View>
      ) : (
        <FlatList
          data={jobs}
          renderItem={renderJobCard}
          keyExtractor={(item) => item.job_id}
          contentContainerStyle={styles.listContent}
          scrollEnabled
        />
      )}
    </SafeAreaView>
  );
}

// Messages Screen
function MessagesScreen({ navigation }) {
  const [threads, setThreads] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadThreads();
    // Refresh every 5 seconds for real-time feel
    const interval = setInterval(loadThreads, 5000);
    return () => clearInterval(interval);
  }, []);

  const loadThreads = async () => {
    try {
      const token = await AsyncStorage.getItem('veritas_token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/messages/threads`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setThreads(data.data || []);
    } catch (error) {
      console.error('Failed to load threads:', error);
    } finally {
      setLoading(false);
    }
  };

  const renderThreadCard = ({ item }) => (
    <TouchableOpacity
      style={styles.threadCard}
      onPress={() =>
        navigation.navigate('Chat', { threadId: item.thread_id })
      }
    >
      <View style={styles.threadHeader}>
        <Text style={styles.threadName}>
          {item.participants.map((p) => p.name).join(', ')}
        </Text>
        {item.unread_count > 0 && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.unread_count}</Text>
          </View>
        )}
      </View>

      <Text style={styles.threadMessage} numberOfLines={1}>
        {item.last_message}
      </Text>

      <Text style={styles.threadTime}>
        {new Date(item.last_message_time).toLocaleTimeString()}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.screenHeader}>
        <Text style={styles.screenTitle}>💬 Messages</Text>
      </View>

      {loading ? (
        <View style={styles.centerContainer}>
          <ActivityIndicator size="large" color="#06b6d4" />
        </View>
      ) : threads.length === 0 ? (
        <View style={styles.centerContainer}>
          <Text style={styles.emptyText}>No messages</Text>
        </View>
      ) : (
        <FlatList
          data={threads}
          renderItem={renderThreadCard}
          keyExtractor={(item) => item.thread_id}
          contentContainerStyle={styles.listContent}
        />
      )}
    </SafeAreaView>
  );
}

// Profile Screen
function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const token = await AsyncStorage.getItem('veritas_token');
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/api/users/me/profile`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      setProfile(data.data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('veritas_token');
          navigation.replace('Login');
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <View style={styles.profileHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>👤</Text>
          </View>

          {loading ? (
            <ActivityIndicator color="#06b6d4" size="large" />
          ) : profile ? (
            <>
              <Text style={styles.profileName}>{profile.name}</Text>
              <Text style={styles.profileRole}>{profile.role}</Text>

              <View style={styles.statsContainer}>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>{profile.truscore}</Text>
                  <Text style={styles.statLabel}>TruScore</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {profile.stats.jobs_completed}
                  </Text>
                  <Text style={styles.statLabel}>Jobs</Text>
                </View>
                <View style={styles.stat}>
                  <Text style={styles.statValue}>
                    {profile.stats.avg_rating.toFixed(1)}⭐
                  </Text>
                  <Text style={styles.statLabel}>Rating</Text>
                </View>
              </View>

              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate('Settings')}
              >
                <Text style={styles.buttonText}>⚙️ Settings</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.button, styles.dangerButton]}
                onPress={handleLogout}
              >
                <Text style={styles.buttonText}>🚪 Logout</Text>
              </TouchableOpacity>
            </>
          ) : null}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

// ============ MAIN NAVIGATION ============

function MainApp() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color }) => {
          let iconName;

          if (route.name === 'Jobs') {
            iconName = focused ? 'briefcase' : 'briefcase-outline';
          } else if (route.name === 'Messages') {
            iconName = focused ? 'chatbubble' : 'chatbubble-outline';
          } else if (route.name === 'Profile') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return <Ionicons name={iconName} size={24} color={color} />;
        },
        tabBarActiveTintColor: '#06b6d4',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: styles.tabBar,
      })}
    >
      <Tab.Screen name="Jobs" component={JobsScreen} />
      <Tab.Screen name="Messages" component={MessagesScreen} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

// ============ APP ROOT ============

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          animationEnabled: true,
        }}
      >
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="MainApp" component={MainApp} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

// ============ STYLES ============

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
  },
  header: {
    marginBottom: 40,
    marginTop: 20,
  },
  title: {
    fontSize: 36,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 14,
    color: '#888',
  },
  form: {
    gap: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#888',
    marginBottom: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#374151',
    borderRadius: 12,
    paddingHorizontal: 12,
    backgroundColor: '#1f2937',
  },
  input: {
    flex: 1,
    paddingVertical: 12,
    marginLeft: 8,
    color: '#fff',
    fontSize: 14,
  },
  button: {
    backgroundColor: '#0ea5e9',
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
  link: {
    color: '#06b6d4',
    textAlign: 'center',
    fontSize: 14,
  },
  screenHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  screenTitle: {
    fontSize: 28,
    fontWeight: '900',
    color: '#fff',
  },
  filterButton: {
    padding: 8,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  listContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  jobCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  jobHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  jobBudget: {
    fontSize: 16,
    fontWeight: '900',
    color: '#06b6d4',
  },
  jobDescription: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 8,
  },
  jobFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  skillsContainer: {
    flexDirection: 'row',
    gap: 4,
  },
  skillBadge: {
    backgroundColor: '#374151',
    color: '#aaa',
    fontSize: 11,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  jobMeta: {
    fontSize: 12,
    color: '#666',
  },
  threadCard: {
    backgroundColor: '#1f2937',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#374151',
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  threadName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    flex: 1,
  },
  badge: {
    backgroundColor: '#0ea5e9',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  threadMessage: {
    fontSize: 13,
    color: '#aaa',
    marginBottom: 4,
  },
  threadTime: {
    fontSize: 11,
    color: '#666',
  },
  profileHeader: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#0ea5e9',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarText: {
    fontSize: 40,
  },
  profileName: {
    fontSize: 24,
    fontWeight: '900',
    color: '#fff',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: 24,
    paddingHorizontal: 40,
  },
  stat: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: '900',
    color: '#06b6d4',
  },
  statLabel: {
    fontSize: 12,
    color: '#888',
    marginTop: 4,
  },
  dangerButton: {
    backgroundColor: '#dc2626',
  },
  tabBar: {
    backgroundColor: '#1f2937',
    borderTopColor: '#374151',
    borderTopWidth: 1,
  },
});

// Don't forget to import TextInput if using it
import { TextInput } from 'react-native';
