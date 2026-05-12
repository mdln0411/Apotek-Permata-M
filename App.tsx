// ===== App.tsx =====
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, StatusBar, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createMaterialTopTabNavigator, MaterialTopTabBarProps } from "@react-navigation/material-top-tabs";

import TabInfo from "./screens/TabInfo";
import TabStokDosis from "./screens/TabStokDosis";
import TabInteraksi from "./screens/TabInteraksi";
import TabBantuan from "./screens/TabBantuan";

// ── Types ──────────────────────────────────────────────
type RootTabParamList = {
  Info: undefined;
  StokDosis: undefined;
  Interaksi: undefined;
  Bantuan: undefined;
};

const Tab = createMaterialTopTabNavigator<RootTabParamList>();

// ── Custom Pill Tab Bar ────────────────────────────────
function CustomTabBar({ state, descriptors, navigation }: MaterialTopTabBarProps) {
  return (
    <View style={styles.tabBarContainer}>
      {state.routes.map((route, index: number) => {
        const { options } = descriptors[route.key];
        const label = typeof options.tabBarLabel === "string" ? options.tabBarLabel : route.name;
        const isFocused = state.index === index;

        const onPress = () => {
          const event = navigation.emit({
            type: "tabPress",
            target: route.key,
            canPreventDefault: true,
          });
          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name);
          }
        };

        return (
          <TouchableOpacity key={route.key} onPress={onPress} style={[styles.tabItem, isFocused ? styles.tabItemActive : styles.tabItemInactive]} activeOpacity={0.8}>
            <Text numberOfLines={1} style={[styles.tabLabel, isFocused ? styles.tabLabelActive : styles.tabLabelInactive]}>{label}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

// ── Tab Navigator ──────────────────────────────────────
function MainTabs() {
  return (
    <Tab.Navigator tabBar={(props) => <CustomTabBar {...props} />} screenOptions={{ swipeEnabled: true }}>
      <Tab.Screen name="Info" component={TabInfo} options={{ tabBarLabel: "Info" }} />
      <Tab.Screen name="StokDosis" component={TabStokDosis} options={{ tabBarLabel: "Stok & Dosis" }} />
      <Tab.Screen name="Interaksi" component={TabInteraksi} options={{ tabBarLabel: "Interaksi" }} />
      <Tab.Screen name="Bantuan" component={TabBantuan} options={{ tabBarLabel: "Bantuan" }} />
    </Tab.Navigator>
  );
}

// ── Root App ───────────────────────────────────────────
export default function App() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar backgroundColor="#2E7D32" barStyle="light-content" />
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.headerLeft} activeOpacity={0.7}>
            <Text style={styles.headerBackArrow}>←</Text>
            <Text style={styles.headerTitle}>Detail Obat</Text>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Text style={styles.headerIcon}>♡</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerIconBtn} activeOpacity={0.7}>
              <Text style={styles.headerIcon}>⋮</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Tab Content */}
        <View style={styles.navContainer}>
          <MainTabs />
        </View>
      </SafeAreaView>
    </NavigationContainer>
  );
}

// ── Styles ─────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    width: "100%",
    backgroundColor: "#2E7D32",
    ...(Platform.OS === "web" ? { height: "100vh" as any } : {}),
  },
  header: {
    backgroundColor: "#2E7D32",
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerBackArrow: {
    color: "#FFFFFF",
    fontSize: 22,
    marginRight: 8,
    fontWeight: "bold",
  },
  headerTitle: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconBtn: {
    marginLeft: 16,
  },
  headerIcon: {
    color: "#FFFFFF",
    fontSize: 20,
  },
  navContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#FFFFFF",
  },
  // Tab Bar
  tabBarContainer: {
    flexDirection: "row",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    height: 52,
    alignItems: "center",
    paddingHorizontal: 0,
    paddingVertical: 4,
    gap: 0,
  },
  tabItem: {
    flex: 1,
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 7,
    alignItems: "center",
    justifyContent: "center",
    marginHorizontal: 2,
  },
  tabItemActive: {
    backgroundColor: "#2E7D32",
  },
  tabItemInactive: {
    backgroundColor: "transparent",
    borderWidth: 1,
    borderColor: "#BDBDBD",
  },
  tabLabel: {
    fontSize: 12,
    fontWeight: "600",
    flexShrink: 1,
  },
  tabLabelActive: {
    color: "#FFFFFF",
  },
  tabLabelInactive: {
    color: "#757575",
  },
});
