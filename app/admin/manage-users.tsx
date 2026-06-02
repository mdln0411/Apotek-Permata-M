import axiosClient from '@/api/axiosClient';
import AdminSidebar from '@/components/AdminSidebar';
import { Feather, Ionicons } from '@expo/vector-icons';
import { router, Stack } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { 
    SafeAreaView, 
    ScrollView, 
    StyleSheet, 
    Text, 
    TouchableOpacity, 
    View, 
    TextInput,
    Platform,
    Switch,
    ActivityIndicator,
    Modal,
} from 'react-native';

type AdminUser = {
    id: number;
    name: string;
    email: string;
    role: string;
    phone?: string | null;
    address?: string | null;
    is_active?: boolean;
    created_at: string;
};

const isAdminUser = (user: AdminUser) => user.role === 'admin';

const isUserActive = (user: AdminUser) => user.is_active !== false;

const normalizeUser = (user: any): AdminUser => ({
    ...user,
    is_active: user.is_active !== false,
});

export default function ManageUsers() {
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarVisible, setSidebarVisible] = useState(false);
    const [users, setUsers] = useState<AdminUser[]>([]);
    const [loading, setLoading] = useState(true);

    // Modal State
    const [modalVisible, setModalVisible] = useState(false);
    const [isEditing, setIsEditing] = useState(false);
    const [currentId, setCurrentId] = useState<number | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        role: 'member',
        phone: '',
        address: '',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            setLoading(true);
            const response = await axiosClient.get('/api/admin/users');
            if (response.data && response.data.data) {
                setUsers(response.data.data.map(normalizeUser));
            } else {
                alert('Debug: Server mengirim data kosong');
            }
        } catch (error: any) {
            alert(`Error API: ${error.response?.status || 'Unknown'} - ${error.message}`);
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setFormData({ name: '', email: '', password: '', role: 'member', phone: '', address: '' });
        setIsEditing(false);
        setModalVisible(true);
    };

    const handleEdit = (user: AdminUser) => {
        const safeRole = user.role === 'apoteker' ? 'apoteker' : 'member';
        setFormData({ 
            name: user.name, 
            email: user.email, 
            password: '', 
            role: safeRole,
            phone: user.phone || '',
            address: user.address || ''
        });
        setCurrentId(user.id);
        setIsEditing(true);
        setModalVisible(true);
    };

    const handleSave = async () => {
        if (!formData.name || !formData.email || (!isEditing && !formData.password)) {
            alert('Mohon isi semua field yang wajib');
            return;
        }

        if (formData.role !== 'member' && formData.role !== 'apoteker') {
            alert('Role tidak valid. Pilih Member atau Apoteker.');
            return;
        }

        if (formData.password && formData.password.length < 8) {
            alert('Password minimal 8 karakter');
            return;
        }

        try {
            if (isEditing && currentId) {
                const updateData: Record<string, string> = {
                    name: formData.name,
                    email: formData.email,
                    role: formData.role,
                    phone: formData.phone,
                    address: formData.address,
                };
                if (formData.password.trim()) {
                    updateData.password = formData.password;
                }
                await axiosClient.put(`/api/admin/users/${currentId}`, updateData);
                alert('Data user berhasil diperbarui');
            } else {
                await axiosClient.post('/api/admin/users', formData);
                alert('User baru berhasil ditambahkan');
            }
            setModalVisible(false);
            fetchUsers();
        } catch (error: any) {
            alert(error.response?.data?.message || 'Gagal menyimpan data user');
        }
    };

    const handleDelete = (id: number) => {
        if (confirm('Yakin ingin menghapus user ini?')) {
            (async () => {
                try {
                    await axiosClient.delete(`/api/admin/users/${id}`);
                    fetchUsers();
                } catch (error) {
                    alert('Gagal menghapus user');
                }
            })();
        }
    };

    const manageableUsers = users.filter((u) => !isAdminUser(u));

    const filteredUsers = manageableUsers.filter(u => 
        u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        u.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const toggleUserStatus = async (id: number) => {
        const user = users.find((u) => u.id === id);
        if (!user) return;

        const nextActive = !isUserActive(user);
        const previousUsers = users;

        setUsers((prev) =>
            prev.map((u) => (u.id === id ? { ...u, is_active: nextActive } : u))
        );

        try {
            await axiosClient.put(`/api/admin/users/${id}`, { is_active: nextActive });
        } catch {
            setUsers(previousUsers);
            alert('Gagal mengubah status user');
        }
    };

    return (
        <SafeAreaView style={styles.container}>
            <Stack.Screen options={{ headerShown: false }} />

            <AdminSidebar 
                visible={sidebarVisible} 
                onClose={() => setSidebarVisible(false)} 
                activePage="users" 
            />

            {/* Modal Form */}
            {modalVisible && (
                <Modal
                    visible={modalVisible}
                    animationType="slide"
                    transparent={true}
                    onRequestClose={() => setModalVisible(false)}
                >
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <View style={styles.modalHeader}>
                                <Text style={styles.modalTitle}>{isEditing ? 'Edit Pengguna' : 'Tambah Pengguna Baru'}</Text>
                                <TouchableOpacity onPress={() => setModalVisible(false)}>
                                    <Ionicons name="close" size={24} color="#333" />
                                </TouchableOpacity>
                            </View>

                            <ScrollView showsVerticalScrollIndicator={false} style={styles.formScroll}>
                                <Text style={styles.inputLabel}>Nama Lengkap *</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="Masukkan nama lengkap"
                                    value={formData.name}
                                    onChangeText={(text) => setFormData({...formData, name: text})}
                                />

                                <Text style={styles.inputLabel}>Email *</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="nama@mail.com"
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    value={formData.email}
                                    onChangeText={(text) => setFormData({...formData, email: text})}
                                />

                                <Text style={styles.inputLabel}>Nomor Telepon</Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder="0812..."
                                    keyboardType="phone-pad"
                                    value={formData.phone}
                                    onChangeText={(text) => setFormData({...formData, phone: text})}
                                />

                                <Text style={styles.inputLabel}>Alamat</Text>
                                <TextInput 
                                    style={[styles.input, { height: 80, textAlignVertical: 'top' }]}
                                    placeholder="Alamat lengkap"
                                    multiline
                                    numberOfLines={3}
                                    value={formData.address}
                                    onChangeText={(text) => setFormData({...formData, address: text})}
                                />

                                <Text style={styles.inputLabel}>
                                    {isEditing ? 'Password Baru (opsional)' : 'Password *'}
                                </Text>
                                <TextInput 
                                    style={styles.input}
                                    placeholder={isEditing ? 'Kosongkan jika tidak diubah' : 'Minimal 8 karakter'}
                                    secureTextEntry
                                    value={formData.password}
                                    onChangeText={(text) => setFormData({...formData, password: text})}
                                />

                                <Text style={styles.inputLabel}>Role / Peran *</Text>
                                <View style={styles.roleSelection}>
                                    <TouchableOpacity 
                                        style={[styles.roleOption, formData.role === 'member' && styles.roleOptionActive]}
                                        onPress={() => setFormData({ ...formData, role: 'member' })}
                                    >
                                        <Text style={[styles.roleOptionText, formData.role === 'member' && styles.roleOptionTextActive]}>
                                            MEMBER
                                        </Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity 
                                        style={[styles.roleOption, formData.role === 'apoteker' && styles.roleOptionActive]}
                                        onPress={() => setFormData({ ...formData, role: 'apoteker' })}
                                    >
                                        <Text style={[styles.roleOptionText, formData.role === 'apoteker' && styles.roleOptionTextActive]}>
                                            APOTEKER
                                        </Text>
                                    </TouchableOpacity>
                                </View>
                            </ScrollView>

                            <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                                <Text style={styles.saveBtnText}>{isEditing ? 'Simpan Perubahan' : 'Buat Akun'}</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            )}

            {/* Header */}
            <View style={styles.topBar}>
                <View style={styles.headerLeft}>
                    <TouchableOpacity onPress={() => setSidebarVisible(true)} style={styles.menuIcon}>
                        <Ionicons name="menu" size={28} color="#FFF" />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => router.back()} style={styles.backRow}>
                        <Ionicons name="arrow-back" size={20} color="#FFF" />
                        <Text style={styles.backText}>Kembali</Text>
                    </TouchableOpacity>
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
                
                {/* Title & Add Button */}
                <View style={styles.headerRow}>
                    <View>
                        <Text style={styles.pageTitle}>Data Pengguna</Text>
                        <Text style={styles.pageSub}>{manageableUsers.length} total akun</Text>
                    </View>
                    <TouchableOpacity style={styles.addBtn} onPress={handleAdd}>
                        <Ionicons name="person-add" size={18} color="#FFF" />
                        <Text style={styles.addBtnText}>Tambah</Text>
                    </TouchableOpacity>
                </View>

                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Ionicons name="search-outline" size={20} color="#999" style={styles.searchIcon} />
                    <TextInput 
                        style={styles.searchInput}
                        placeholder="Cari nama atau email..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
                </View>

                {/* User List */}
                <View style={styles.listContainer}>
                    {loading ? (
                        <ActivityIndicator size="large" color="#2E8B57" style={{ marginTop: 20 }} />
                    ) : filteredUsers.map((user) => {
                        const active = isUserActive(user);
                        return (
                        <View key={user.id} style={[styles.userCard, !active && styles.inactiveCard]}>
                            <View style={styles.avatarWrapper}>
                                <View style={styles.avatar}>
                                    <Ionicons name="person" size={24} color="#2E8B57" />
                                </View>
                            </View>

                            <View style={styles.userInfo}>
                                <View style={styles.nameRoleRow}>
                                    <Text style={styles.userName} numberOfLines={1}>{user.name}</Text>
                                    <View style={[styles.roleBadge, { backgroundColor: user.role === 'apoteker' ? '#2E8B57' : '#E8F5E9' }]}>
                                        <Text style={[styles.roleText, { color: user.role === 'member' ? '#2E8B57' : '#FFF' }]}>{user.role.toUpperCase()}</Text>
                                    </View>
                                </View>
                                <Text style={styles.userEmail}>{user.email}</Text>
                                <Text style={styles.userMeta}>Bergabung: {new Date(user.created_at).toLocaleDateString('id-ID')}</Text>
                                
                                <View style={styles.actionButtonsRow}>
                                    <TouchableOpacity style={styles.smallEditBtn} onPress={() => handleEdit(user)}>
                                        <Feather name="edit-2" size={14} color="#2E8B57" />
                                        <Text style={styles.smallEditBtnText}>Edit</Text>
                                    </TouchableOpacity>
                                    <TouchableOpacity style={styles.smallDeleteBtn} onPress={() => handleDelete(user.id)}>
                                        <Feather name="trash-2" size={14} color="#FF5252" />
                                        <Text style={styles.smallDeleteBtnText}>Hapus</Text>
                                    </TouchableOpacity>
                                </View>
                            </View>

                            <View style={styles.actionArea}>
                                <Switch 
                                    value={active} 
                                    onValueChange={() => toggleUserStatus(user.id)}
                                    trackColor={{ false: '#DDD', true: '#A5D6A7' }}
                                    thumbColor={active ? '#2E8B57' : '#FFF'}
                                />
                            </View>
                        </View>
                        );
                    })}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#F8FBF8' },
    topBar: { 
        flexDirection: 'row', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        paddingHorizontal: 16, 
        paddingTop: Platform.OS === 'ios' ? 20 : 50, 
        paddingBottom: 20, 
        backgroundColor: '#2E8B57' 
    },
    headerLeft: { flexDirection: 'row', alignItems: 'center', gap: 5 },
    menuIcon: { width: 40, height: 40, justifyContent: 'center', alignItems: 'center' },
    backRow: { flexDirection: 'row', alignItems: 'center', gap: 4 },
    backText: { color: '#FFF', fontSize: 14, fontWeight: '500' },
    scrollContent: { padding: 20 },
    headerRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 },
    headerTitleRow: { marginBottom: 20 },
    pageTitle: { fontSize: 22, fontWeight: 'bold', color: '#333' },
    pageSub: { fontSize: 13, color: '#999', marginTop: 2 },
    addBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#2E8B57', paddingHorizontal: 16, paddingVertical: 10, borderRadius: 10, gap: 6 },
    addBtnText: { color: '#FFF', fontSize: 14, fontWeight: 'bold' },
    searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF', borderRadius: 12, paddingHorizontal: 16, height: 50, borderWidth: 1, borderColor: '#EEE', marginBottom: 24 },
    searchIcon: { marginRight: 12 },
    searchInput: { flex: 1, fontSize: 15, color: '#333' },
    listContainer: { gap: 16 },
    userCard: { backgroundColor: '#FFF', borderRadius: 16, padding: 16, flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    inactiveCard: { opacity: 0.6 },
    avatarWrapper: { marginRight: 16 },
    avatar: { width: 50, height: 50, borderRadius: 25, backgroundColor: '#F0F4F0', justifyContent: 'center', alignItems: 'center', borderWidth: 1, borderColor: '#E8F5E9' },
    userInfo: { flex: 1 },
    nameRoleRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 2 },
    userName: { fontSize: 15, fontWeight: 'bold', color: '#333' },
    roleBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
    roleText: { fontSize: 10, fontWeight: 'bold' },
    userEmail: { fontSize: 12, color: '#666', marginBottom: 4 },
    userMeta: { fontSize: 11, color: '#999' },
    actionArea: { alignItems: 'flex-end', justifyContent: 'center' },
    actionButtonsRow: { flexDirection: 'row', gap: 12, marginTop: 10 },
    smallEditBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#E8F5E9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    smallEditBtnText: { fontSize: 11, color: '#2E8B57', fontWeight: 'bold' },
    smallDeleteBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FFEBEE', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 6 },
    smallDeleteBtnText: { fontSize: 11, color: '#FF5252', fontWeight: 'bold' },
    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
    modalContent: { backgroundColor: '#FFF', borderTopLeftRadius: 30, borderTopRightRadius: 30, padding: 24, height: '80%' },
    modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    modalTitle: { fontSize: 20, fontWeight: 'bold', color: '#333' },
    formScroll: { flex: 1 },
    inputLabel: { fontSize: 14, fontWeight: '600', color: '#555', marginBottom: 8, marginTop: 16 },
    input: { backgroundColor: '#F8FBF8', borderWidth: 1, borderColor: '#E8F5E9', borderRadius: 12, padding: 14, fontSize: 15, color: '#333' },
    roleSelection: { flexDirection: 'row', gap: 10, marginTop: 10 },
    roleOption: { flex: 1, paddingVertical: 12, borderRadius: 12, backgroundColor: '#F5F5F5', alignItems: 'center', borderWidth: 1, borderColor: '#EEE' },
    roleOptionActive: { backgroundColor: '#E8F5E9', borderColor: '#2E8B57' },
    roleOptionText: { fontSize: 11, fontWeight: 'bold', color: '#999' },
    roleOptionTextActive: { color: '#2E8B57' },
    saveBtn: { backgroundColor: '#2E8B57', borderRadius: 14, padding: 16, alignItems: 'center', marginTop: 20, shadowColor: '#2E8B57', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.3, shadowRadius: 8, elevation: 5 },
    saveBtnText: { color: '#FFF', fontSize: 16, fontWeight: 'bold' },
    statusLabel: { fontSize: 10, color: '#999', fontWeight: 'bold' }
});
