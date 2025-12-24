from collections import defaultdict
_sessions = defaultdict(list)

def create_session(session_id: str):
    _sessions[session_id] = []

def add_message(session_id: str, role: str, content: str):
    _sessions[session_id].append({
        "role": role,
        "content": content
    })

def get_history(session_id: str):
    return _sessions.get(session_id, [])
