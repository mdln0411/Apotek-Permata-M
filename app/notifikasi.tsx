import axiosClient from "@/api/axiosClient";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import { Stack, useRouter } from "expo-router";
import React, { useEffect, useState } from "react";
import {
    ActivityIndicator,
    RefreshControl,
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

const THEME = {
  primary: "#2E8B57", // Hijau Apotek
  background: "#F0F4F7",
  white: "#FFFFFF",
  textDark: "#2C3E50",
  textMuted: "#7F8C8D",
  border: "#E0E6ED",
};

interface AppNotification {
  id: string;
  data: {
    title: string;
    message: string;
    type: "order" | "info" | "reminder" | "promo";
  };
  read_at: string | null;
  created_at: string;
}

export default function NotificationScreen() {
  const router = useRouter();
  const [notifs, setNotifs] = useState<AppNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchNotifications = async () => {
    try {
      const response = await axiosClient.get("/api/notifications");
      if (response.data && response.data.data) {
        setNotifs(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const markAsRead = async (id: string) => {
    try {
      await axiosClient.post(`/api/notifications/${id}/read`);
      setNotifs((prev) =>
        prev.map((n) =>
          n.id === id ? { ...n, read_at: new Date().toISOString() } : n,
        ),
      );
    } catch (error) {
      console.error("Error marking notification as read:", error);
    }
  };

  const markAllAsRead = async () => {
    try {
      await axiosClient.post("/api/notifications/read-all");
      setNotifs((prev) =>
        prev.map((n) => ({ ...n, read_at: new Date().toISOString() })),
      );
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const deleteNotification = async (id: string) => {
    try {
      await axiosClient.delete(`/api/notifications/${id}`);
      setNotifs((prev) => prev.filter((n) => n.id !== id));
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    // Listen for incoming notifications while app is open
    const subscription = Notifications.addNotificationReceivedListener(
      (notification) => {
        const data = notification.request.content.data;
        if (data && data.type) {
          const newNotif: AppNotification = {
            id: Math.random().toString(),
            data: {
              title: String(
                data.title || notification.request.content.title || "",
              ),
              message: String(
                data.message || notification.request.content.body || "",
              ),
              type: data.type as any,
            },
            read_at: null,
            created_at: new Date().toISOString(),
          };
          setNotifs((prev) => [newNotif, ...prev]);
        }
      },
    );

    return () => subscription.remove();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchNotifications();
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "order":
        return "package-variant-closed";
      case "reminder":
        return "bell-ring-outline";
      case "promo":
        return "sale";
      default:
        return "information-outline";
    }
  };

  const getIconColor = (type: string) => {
    switch (type) {
      case "order":
        return "#1976D2";
      case "reminder":
        return "#7B1FA2";
      case "promo":
        return "#F57C00";
      default:
        return "#2E8B57";
    }
  };

  const getBgColor = (type: string) => {
    switch (type) {
      case "order":
        return "#E3F2FD";
      case "reminder":
        return "#F3E5F5";
      case "promo":
        return "#FFF3E0";
      default:
        return "#E8F5E9";
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={THEME.primary} />
      <Stack.Screen
        options={{
          headerTitle: "Notifikasi",
          headerTintColor: THEME.white,
          headerTitleStyle: { fontWeight: "bold" },
          headerLeft: () => (
            <TouchableOpacity
              onPress={() => router.replace("/(tabs)")}
              style={{ marginLeft: 10 }}
            >
              <Ionicons name="close" size={28} color={THEME.white} />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={markAllAsRead}
              style={{ marginRight: 15 }}
            >
              <Text style={{ color: THEME.white, fontWeight: "bold" }}>
                Baca Semua
              </Text>
            </TouchableOpacity>
          ),
          headerShadowVisible: false,
          headerStyle: { backgroundColor: THEME.primary },
        }}
      />

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={[THEME.primary]}
          />
        }
      >
        {loading && !refreshing ? (
          <ActivityIndicator
            size="large"
            color={THEME.primary}
            style={{ marginTop: 50 }}
          />
        ) : notifs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="bell-off-outline"
              size={80}
              color="#CCC"
            />
            <Text style={styles.emptyText}>Tidak ada notifikasi baru</Text>
          </View>
        ) : (
          notifs.map((item) => (
            <TouchableOpacity
              key={item.id}
              style={[styles.notifItem, !item.read_at && styles.unreadItem]}
              onPress={() => markAsRead(item.id)}
            >
              <View
                style={[
                  styles.iconBox,
                  { backgroundColor: getBgColor(item.data.type) },
                ]}
              >
                <MaterialCommunityIcons
                  name={getIcon(item.data.type) as any}
                  size={24}
                  color={getIconColor(item.data.type)}
                />
              </View>
              <View style={styles.contentBox}>
                <Text
                  style={[
                    styles.notifTitle,
                    !item.read_at && styles.unreadTitle,
                  ]}
                >
                  {item.data.title}
                </Text>
                <Text style={styles.notifDesc}>{item.data.message}</Text>
                <Text style={styles.notifTime}>
                  {new Date(item.created_at).toLocaleDateString("id-ID", {
                    day: "numeric",
                    month: "short",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Text>
              </View>
              <View style={styles.rightActions}>
                <TouchableOpacity
                  onPress={() => deleteNotification(item.id)}
                  style={styles.deleteBtn}
                >
                  <Ionicons name="trash-outline" size={20} color="#E74C3C" />
                </TouchableOpacity>
                {!item.read_at && <View style={styles.unreadDot} />}
              </View>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: THEME.background },
  scrollContent: { padding: 15 },
  notifItem: {
    flexDirection: "row",
    backgroundColor: THEME.white,
    borderRadius: 16,
    padding: 15,
    marginBottom: 12,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "transparent",
  },
  unreadItem: {
    borderColor: THEME.border,
    backgroundColor: "#FFF",
  },
  iconBox: {
    width: 50,
    height: 50,
    borderRadius: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  contentBox: { flex: 1, marginLeft: 15 },
  notifTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: THEME.textDark,
    marginBottom: 4,
  },
  unreadTitle: { color: "#000" },
  notifDesc: { fontSize: 13, color: THEME.textMuted, lineHeight: 18 },
  notifTime: { fontSize: 11, color: THEME.textMuted, marginTop: 8 },
  unreadDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "#E74C3C",
  },
  rightActions: {
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    marginLeft: 8,
  },
  deleteBtn: {
    padding: 6,
  },
  emptyContainer: { flex: 1, alignItems: "center", marginTop: 100 },
  emptyText: { marginTop: 20, fontSize: 16, color: "#999" },
});
