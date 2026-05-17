@extends('layouts.apoteker')

@section('page_title', 'Konsultasi Online')

@section('content')
<div class="bg-white rounded-[2.5rem] shadow-sm border border-slate-100 overflow-hidden h-[calc(100vh-180px)] flex">
    <!-- Chat List -->
    <div class="w-80 border-r border-slate-100 flex flex-col">
        <div class="p-6 border-b border-slate-50">
            <h3 class="font-bold text-slate-800">Pesan Masuk</h3>
        </div>
        <div class="flex-1 overflow-y-auto">
            @foreach($consultations as $c)
            <button onclick="loadChat({{ $c->id }}, '{{ $c->user->name }}')" class="w-full p-6 text-left border-b border-slate-50 hover:bg-slate-50 transition-all group flex items-center gap-4">
                <div class="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-700 font-bold group-hover:scale-110 transition-transform">
                    {{ substr($c->user->name, 0, 1) }}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex justify-between items-center mb-1">
                        <p class="font-bold text-slate-800 truncate">{{ $c->user->name }}</p>
                    </div>
                    <p class="text-[10px] text-slate-400 truncate">{{ $c->messages->first()->message ?? 'Mulai konsultasi...' }}</p>
                </div>
            </button>
            @endforeach
        </div>
    </div>

    <!-- Chat Window -->
    <div id="chat-window" class="flex-1 flex flex-col bg-slate-50/30 hidden">
        <div class="p-6 bg-white border-b border-slate-100 flex items-center justify-between">
            <div class="flex items-center gap-4">
                <div class="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white font-bold" id="active-user-avatar">
                </div>
                <div>
                    <h4 class="font-bold text-slate-800" id="active-user-name"></h4>
                    <p class="text-[10px] text-emerald-600 flex items-center gap-1">
                        <span class="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span> Online
                    </p>
                </div>
            </div>
            <button class="p-2 text-slate-400 hover:text-slate-600"><i data-lucide="more-vertical" class="w-5 h-5"></i></button>
        </div>

        <div id="messages-container" class="flex-1 overflow-y-auto p-8 space-y-4">
            <!-- Messages will be injected here -->
        </div>

        <div class="p-6 bg-white border-t border-slate-100">
            <form id="send-form" class="flex gap-4">
                @csrf
                <input type="text" id="message-input" placeholder="Ketik pesan anda..." class="flex-1 px-6 py-4 bg-slate-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-emerald-500 outline-none">
                <button type="submit" class="bg-emerald-600 text-white w-14 h-14 rounded-2xl flex items-center justify-center shadow-lg shadow-emerald-200 hover:bg-emerald-700 transition-all">
                    <i data-lucide="send" class="w-6 h-6"></i>
                </button>
            </form>
        </div>
    </div>

    <!-- Empty State -->
    <div id="empty-chat" class="flex-1 flex flex-col items-center justify-center text-center p-20">
        <div class="w-24 h-24 bg-slate-100 rounded-[2rem] flex items-center justify-center mb-6">
            <i data-lucide="message-square" class="w-10 h-10 text-slate-300"></i>
        </div>
        <h3 class="text-xl font-bold text-slate-800 mb-2">Pilih Konsultasi</h3>
        <p class="text-slate-400 text-sm max-w-xs">Silakan pilih salah satu percakapan di sebelah kiri untuk mulai membalas pesan pasien.</p>
    </div>
</div>

<script>
    let currentConsultationId = null;
    let pollInterval = null;

    async function loadChat(id, name) {
        currentConsultationId = id;
        document.getElementById('empty-chat').classList.add('hidden');
        document.getElementById('chat-window').classList.remove('hidden');
        document.getElementById('active-user-name').innerText = name;
        document.getElementById('active-user-avatar').innerText = name.charAt(0);
        
        await fetchMessages();
        
        // Mark as read
        await fetch(`/apoteker/chat/${id}/read`, {
            method: 'POST',
            headers: { 'X-CSRF-TOKEN': '{{ csrf_token() }}' }
        });
        
        // Poll for new messages every 3 seconds
        if(pollInterval) clearInterval(pollInterval);
        pollInterval = setInterval(fetchMessages, 3000);
        
        lucide.createIcons();
    }


    async function fetchMessages() {
        if(!currentConsultationId) return;
        
        const response = await fetch(`/apoteker/chat/${currentConsultationId}/messages`);
        const messages = await response.json();
        
        const container = document.getElementById('messages-container');
        const isAtBottom = container.scrollHeight - container.scrollTop <= container.clientHeight + 100;
        
        container.innerHTML = '';
        messages.forEach(m => {
            const isMe = m.user_id == {{ auth()->id() }};
            const html = `
                <div class="flex ${isMe ? 'justify-end' : 'justify-start'}">
                    <div class="max-w-[70%] ${isMe ? 'bg-emerald-600 text-white rounded-t-[1.5rem] rounded-bl-[1.5rem]' : 'bg-white text-slate-800 rounded-t-[1.5rem] rounded-br-[1.5rem] shadow-sm'} p-4">
                        <p class="text-sm">${m.message}</p>
                        <p class="text-[8px] mt-2 opacity-60 ${isMe ? 'text-right' : ''}">${new Date(m.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</p>
                    </div>
                </div>
            `;
            container.innerHTML += html;
        });

        if(isAtBottom) {
            container.scrollTop = container.scrollHeight;
        }
    }

    document.getElementById('send-form').onsubmit = async (e) => {
        e.preventDefault();
        const input = document.getElementById('message-input');
        const message = input.value.trim();
        if(!message || !currentConsultationId) return;

        input.value = '';
        const response = await fetch(`/apoteker/chat/${currentConsultationId}/send`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-CSRF-TOKEN': '{{ csrf_token() }}'
            },
            body: JSON.stringify({ message })
        });

        if(response.ok) {
            await fetchMessages();
        }
    }
</script>
@endsection
