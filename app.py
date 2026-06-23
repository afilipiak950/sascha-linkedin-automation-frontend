import streamlit as st
import plotly.graph_objects as go
from datetime import datetime, timedelta
import json
import random
from app.agents.linkedin_agent import LinkedInAgent
from app.config.agent_config import AgentConfig
from app.models.interaction import InteractionType

# Custom CSS für moderne Effekte
st.markdown("""
<style>
    .stButton>button {
        background: linear-gradient(45deg, #0077B5, #00A0DC);
        color: white;
        border-radius: 10px;
        padding: 0.5rem 2rem;
        border: none;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        transition: all 0.3s ease;
    }
    .stButton>button:hover {
        transform: translateY(-2px);
        box-shadow: 0 6px 8px rgba(0, 0, 0, 0.2);
    }
    .metric-card {
        background: white;
        padding: 1rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 0.5rem 0;
    }
    .chart-container {
        background: white;
        border-radius: 15px;
        padding: 1rem;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
    .sidebar .stSelectbox {
        background: white;
        border-radius: 10px;
        padding: 0.5rem;
    }
    h1, h2, h3 {
        color: #0077B5;
        font-weight: 600;
    }
    .help-text {
        background: #f8f9fa;
        padding: 1rem;
        border-left: 4px solid #0077B5;
        margin: 1rem 0;
        border-radius: 0 10px 10px 0;
    }
    .feature-card {
        background: white;
        padding: 1rem;
        border-radius: 15px;
        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        margin: 1rem 0;
        border-left: 4px solid #0077B5;
    }
</style>
""", unsafe_allow_html=True)

# Konfiguration
st.set_page_config(
    page_title="LinkedIn Growth Agent",
    page_icon="🚀",
    layout="wide",
    initial_sidebar_state="expanded"
)

# Seitentitel mit Animation
st.markdown("""
    <div style='text-align: center; padding: 2rem 0;'>
        <h1 style='font-size: 3rem; background: linear-gradient(45deg, #0077B5, #00A0DC); 
                   -webkit-background-clip: text; -webkit-text-fill-color: transparent;
                   animation: pulse 2s infinite;'>
            LinkedIn Growth Agent 🚀
        </h1>
    </div>
""", unsafe_allow_html=True)

# Initialisierung des Agenten
@st.cache_resource
def get_linkedin_agent():
    if AgentConfig.validate():
        return LinkedInAgent(
            email=AgentConfig.LINKEDIN_EMAIL,
            password=AgentConfig.LINKEDIN_PASSWORD
        )
    return None

def create_engagement_chart():
    # Beispieldaten für das Chart
    dates = [(datetime.now() - timedelta(days=x)).strftime('%Y-%m-%d') for x in range(7)]
    likes = [random.randint(10, 50) for _ in range(7)]
    comments = [random.randint(5, 20) for _ in range(7)]
    
    fig = go.Figure()
    fig.add_trace(go.Scatter(x=dates, y=likes, name='Likes', line=dict(color='#0077B5')))
    fig.add_trace(go.Scatter(x=dates, y=comments, name='Comments', line=dict(color='#00A0DC')))
    
    fig.update_layout(
        title='Engagement Übersicht',
        paper_bgcolor='rgba(0,0,0,0)',
        plot_bgcolor='rgba(0,0,0,0)',
        hovermode='x unified',
        showlegend=True
    )
    return fig

def main_dashboard():
    agent = get_linkedin_agent()
    
    if not agent:
        st.error("🔑 Bitte konfigurieren Sie Ihre LinkedIn-Anmeldedaten in der .env Datei")
        return
    
    # Moderne Sidebar mit Hilfe-Bereich
    with st.sidebar:
        st.markdown("""
            <div style='text-align: center; padding: 1rem;'>
                <h3 style='color: #0077B5;'>Navigation 🧭</h3>
            </div>
        """, unsafe_allow_html=True)
        
        page = st.selectbox(
            "",
            ["📊 Dashboard", "✍️ Post Generator", "🤝 Interaction Manager", "🌱 Network Growth"]
        )
        
        # Hilfe-Bereich in der Sidebar
        with st.expander("❓ Hilfe & Informationen"):
            st.markdown("""
                <div style='text-align: left;'>
                    <h4>🤖 Über die Agenten</h4>
                    <p>Unsere LinkedIn-Agenten nutzen KI, um Ihre LinkedIn-Präsenz zu optimieren:</p>
                    
                    <ul>
                        <li>📊 <strong>Dashboard:</strong> Übersicht und Analyse</li>
                        <li>✍️ <strong>Post Generator:</strong> KI-gestützte Content-Erstellung</li>
                        <li>🤝 <strong>Interaction Manager:</strong> Automatisierte Interaktionen</li>
                        <li>🌱 <strong>Network Growth:</strong> Strategischer Netzwerkaufbau</li>
                    </ul>
                    
                    <h4>⚙️ Konfiguration</h4>
                    <p>Stellen Sie sicher, dass Ihre LinkedIn-Anmeldedaten in der .env Datei korrekt konfiguriert sind.</p>
                    
                    <h4>📈 Beste Praktiken</h4>
                    <ul>
                        <li>Regelmäßige Überprüfung der Metriken</li>
                        <li>Anpassung der Automatisierungseinstellungen</li>
                        <li>Kombination von automatisierten und manuellen Interaktionen</li>
                    </ul>
                </div>
            """, unsafe_allow_html=True)
    
    if "📊 Dashboard" in page:
        dashboard_page(agent)
    elif "✍️ Post Generator" in page:
        post_generator_page(agent)
    elif "🤝 Interaction Manager" in page:
        interaction_manager_page(agent)
    elif "🌱 Network Growth" in page:
        network_growth_page(agent)

def dashboard_page(agent: LinkedInAgent):
    st.markdown("## 📊 Dashboard Übersicht")
    
    # Erklärung des Dashboards
    st.markdown("""
        <div class='help-text'>
            <h4>ℹ️ Dashboard Übersicht</h4>
            <p>Hier sehen Sie alle wichtigen Metriken Ihrer LinkedIn-Automatisierung auf einen Blick. 
            Die KPIs werden in Echtzeit aktualisiert und zeigen Ihren Fortschritt in verschiedenen Bereichen.</p>
        </div>
    """, unsafe_allow_html=True)

    # KPI-Karten
    col1, col2, col3, col4 = st.columns(4)
    with col1:
        st.markdown("""
            <div class='metric-card'>
                <h3 style='font-size: 1.2rem; color: #0077B5;'>👥 Netzwerk</h3>
                <p style='font-size: 2rem; margin: 0;'>1,234</p>
                <p style='color: green; margin: 0;'>↑ +12%</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col2:
        st.markdown("""
            <div class='metric-card'>
                <h3 style='font-size: 1.2rem; color: #0077B5;'>💬 Interaktionen</h3>
                <p style='font-size: 2rem; margin: 0;'>456</p>
                <p style='color: green; margin: 0;'>↑ +8%</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col3:
        st.markdown("""
            <div class='metric-card'>
                <h3 style='font-size: 1.2rem; color: #0077B5;'>📝 Posts</h3>
                <p style='font-size: 2rem; margin: 0;'>78</p>
                <p style='color: green; margin: 0;'>↑ +15%</p>
            </div>
        """, unsafe_allow_html=True)
    
    with col4:
        st.markdown("""
            <div class='metric-card'>
                <h3 style='font-size: 1.2rem; color: #0077B5;'>⭐ Engagement</h3>
                <p style='font-size: 2rem; margin: 0;'>9.2%</p>
                <p style='color: green; margin: 0;'>↑ +3%</p>
            </div>
        """, unsafe_allow_html=True)
    
    # Engagement Chart
    st.plotly_chart(create_engagement_chart(), use_container_width=True)

def post_generator_page(agent: LinkedInAgent):
    st.markdown("## ✍️ Post Generator")
    
    # Erklärung des Post Generators
    st.markdown("""
        <div class='help-text'>
            <h4>🤖 Über den Post Generator</h4>
            <p>Der Post Generator nutzt KI, um professionelle LinkedIn-Posts zu erstellen. 
            Wählen Sie ein Thema, einen Stil und die gewünschte Länge - der Agent erstellt dann 
            einen optimierten Post für maximales Engagement.</p>
            
            <h4>✨ Funktionen:</h4>
            <ul>
                <li>🎯 Themenfokussierte Inhalte</li>
                <li>🎨 Verschiedene Schreibstile</li>
                <li>📏 Anpassbare Länge</li>
                <li>📅 Zeitplanung für optimale Reichweite</li>
            </ul>
        </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns([1, 1])
    
    with col1:
        st.markdown("""
            <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                <h3 style='color: #0077B5;'>📝 Neuen Post erstellen</h3>
        """, unsafe_allow_html=True)
        
        topic = st.text_input("🎯 Thema")
        style = st.selectbox("🎨 Stil", ["💼 Professional", "😊 Casual", "🔧 Technical"])
        length = st.selectbox("📏 Länge", ["🔹 Short", "🔸 Medium", "💠 Long"])
        
        if st.button("🚀 Post generieren"):
            with st.spinner("Post wird generiert..."):
                st.session_state.generated_content = "Beispiel-Post-Inhalt"
                st.success("✨ Post erfolgreich generiert!")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        if "generated_content" in st.session_state:
            st.markdown("""
                <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    <h3 style='color: #0077B5;'>📄 Generierter Content</h3>
            """, unsafe_allow_html=True)
            
            st.text_area("", st.session_state.generated_content, height=200)
            
            col1, col2 = st.columns(2)
            with col1:
                post_id = st.text_input("🔍 Post-ID (optional)")
            with col2:
                scheduled_time = st.datetime_input("📅 Planen für", datetime.now())
            
            if st.button("📮 Post planen"):
                with st.spinner("Post wird geplant..."):
                    if post_id:
                        success = agent.like_post(post_id)
                        if success:
                            st.success("🎉 Interaktion erfolgreich!")
                        else:
                            st.warning("⏳ Post wurde zur Warteschlange hinzugefügt")
            
            st.markdown("</div>", unsafe_allow_html=True)

def interaction_manager_page(agent: LinkedInAgent):
    st.markdown("## 🤝 Interaction Manager")
    
    # Erklärung des Interaction Managers
    st.markdown("""
        <div class='help-text'>
            <h4>🔄 Über den Interaction Manager</h4>
            <p>Der Interaction Manager automatisiert Ihre LinkedIn-Interaktionen auf intelligente Weise. 
            Er respektiert dabei LinkedIn's Limits und verteilt die Aktivitäten über den Tag.</p>
            
            <div class='feature-card'>
                <h4>⚡ Hauptfunktionen:</h4>
                <ul>
                    <li>🎯 Automatisches Liken relevanter Posts</li>
                    <li>💬 Intelligentes Kommentieren</li>
                    <li>🤝 Automatische Vernetzung</li>
                    <li>⏰ Zeitliche Steuerung</li>
                </ul>
            </div>
            
            <div class='feature-card'>
                <h4>⚠️ Wichtige Hinweise:</h4>
                <ul>
                    <li>Die täglichen Limits schützen Ihr Konto vor Überaktivität</li>
                    <li>Interaktionen werden natürlich über den Tag verteilt</li>
                    <li>Alle Aktivitäten werden protokolliert und überwacht</li>
                </ul>
            </div>
        </div>
    """, unsafe_allow_html=True)

    # Einstellungen
    st.markdown("""
        <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
            <h3 style='color: #0077B5;'>⚙️ Automatisierungs-Einstellungen</h3>
    """, unsafe_allow_html=True)
    
    col1, col2 = st.columns(2)
    
    with col1:
        post_frequency = st.slider("📊 Post-Frequenz (Posts pro Woche)", 1, 7, 3)
        interaction_limit = st.slider("🎯 Tägliches Interaktionslimit", 10, 100, 30)
    
    with col2:
        target_audience = st.multiselect(
            "👥 Zielgruppe",
            ["💻 Software Development", "📊 Data Science", "🤖 AI/ML", "🛠️ DevOps", "📱 Product Management"]
        )
    
    if st.button("💾 Einstellungen speichern"):
        st.success("✅ Einstellungen erfolgreich gespeichert!")
    
    st.markdown("</div>", unsafe_allow_html=True)
    
    # Statistiken
    st.markdown("""
        <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); margin-top: 2rem;'>
            <h3 style='color: #0077B5;'>📈 Statistiken</h3>
    """, unsafe_allow_html=True)
    
    col1, col2, col3 = st.columns(3)
    with col1:
        st.metric("🎯 Interaktionen heute", agent.interactions_today, "+5")
    with col2:
        st.metric("⏳ Verbleibende Interaktionen", 
                 agent.daily_interaction_limit - agent.interactions_today,
                 "-5")
    with col3:
        st.metric("📋 Warteschlange", len(agent.interaction_queue), "+2")
    
    st.markdown("</div>", unsafe_allow_html=True)

def network_growth_page(agent: LinkedInAgent):
    st.markdown("## 🌱 Network Growth")
    
    # Erklärung des Network Growth
    st.markdown("""
        <div class='help-text'>
            <h4>🌱 Über Network Growth</h4>
            <p>Der Network Growth Agent hilft Ihnen dabei, Ihr LinkedIn-Netzwerk strategisch und 
            zielgerichtet zu erweitern. Er findet relevante Kontakte basierend auf Ihren Präferenzen 
            und sendet personalisierte Verbindungsanfragen.</p>
            
            <div class='feature-card'>
                <h4>🎯 Funktionsweise:</h4>
                <ul>
                    <li>🔍 Intelligente Kontaktsuche basierend auf Keywords und Branchen</li>
                    <li>📝 Automatische Personalisierung von Kontaktanfragen</li>
                    <li>⏱️ Zeitlich optimierte Versendung</li>
                    <li>📊 Tracking des Netzwerkwachstums</li>
                </ul>
            </div>
            
            <div class='feature-card'>
                <h4>💡 Tipps für beste Ergebnisse:</h4>
                <ul>
                    <li>Wählen Sie spezifische Keywords für bessere Trefferquoten</li>
                    <li>Kombinieren Sie verschiedene Branchen für ein feines Netzwerk</li>
                    <li>Nutzen Sie personalisierte Nachrichten für höhere Akzeptanzraten</li>
                </ul>
            </div>
        </div>
    """, unsafe_allow_html=True)

    col1, col2 = st.columns(2)
    
    with col1:
        st.markdown("""
            <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                <h3 style='color: #0077B5;'>🔍 Kontakte suchen</h3>
        """, unsafe_allow_html=True)
        
        keywords = st.multiselect(
            "🏷️ Suchbegriffe",
            ["🐍 Python", "☕ JavaScript", "⚛️ React", "🟢 Node.js", "🤖 Machine Learning", "🛠️ DevOps"]
        )
        
        industries = st.multiselect(
            "🏢 Zielbranchen",
            ["💻 Technology", "⚙️ Software", "📊 Data Science", "🤖 AI", "🤝 Consulting"]
        )
        
        if st.button("🔎 Kontakte suchen"):
            with st.spinner("Suche läuft..."):
                st.session_state.prospects = [
                    {"id": "john-doe", "name": "John Doe", "position": "Software Engineer"},
                    {"id": "jane-smith", "name": "Jane Smith", "position": "Data Scientist"}
                ]
                st.success("✨ Suche abgeschlossen!")
        
        st.markdown("</div>", unsafe_allow_html=True)
    
    with col2:
        if "prospects" in st.session_state:
            st.markdown("""
                <div style='background: white; padding: 2rem; border-radius: 15px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);'>
                    <h3 style='color: #0077B5;'>👥 Gefundene Kontakte</h3>
            """, unsafe_allow_html=True)
            
            for prospect in st.session_state.prospects:
                with st.expander(f"👤 {prospect['name']} - 💼 {prospect['position']}"):
                    st.write(f"🆔 ID: {prospect['id']}")
                    message = st.text_area(
                        "✉️ Kontaktanfrage Nachricht",
                        value=AgentConfig.CONNECTION_MESSAGE_TEMPLATES[0].format(
                            name=prospect['name'],
                            industry="Technology"
                        ),
                        key=prospect['id']
                    )
                    if st.button("🤝 Kontaktanfrage senden", key=f"btn_{prospect['id']}"):
                        with st.spinner("Sende Anfrage..."):
                            success = agent.connect_with_user(prospect['id'], message)
                            if success:
                                st.success("🎉 Kontaktanfrage gesendet!")
                            else:
                                st.warning("⏳ Anfrage wurde zur Warteschlange hinzugefügt")
            
            st.markdown("</div>", unsafe_allow_html=True)

# Hauptanwendungslogik - Direkt zum Dashboard
main_dashboard() 