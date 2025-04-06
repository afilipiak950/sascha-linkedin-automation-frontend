import streamlit as st
import requests
from datetime import datetime
import json

# Konfiguration
st.set_page_config(
    page_title="LinkedIn Growth Agent",
    page_icon="🤖",
    layout="wide"
)

# Seitentitel
st.title("LinkedIn Growth Agent")

def main_dashboard():
    # Sidebar für Navigation
    st.sidebar.title("Navigation")
    page = st.sidebar.selectbox(
        "Wähle eine Seite",
        ["Post Generator", "Interaction Manager", "Network Growth"]
    )
    
    if page == "Post Generator":
        post_generator_page()
    elif page == "Interaction Manager":
        interaction_manager_page()
    elif page == "Network Growth":
        network_growth_page()

def post_generator_page():
    st.header("Post Generator")
    
    col1, col2 = st.columns(2)
    
    with col1:
        topic = st.text_input("Thema")
        style = st.selectbox("Stil", ["Professional", "Casual", "Technical"])
        length = st.selectbox("Länge", ["Short", "Medium", "Long"])
        
        if st.button("Post generieren"):
            try:
                response = requests.post(
                    f"{st.secrets.api_url}/api/posts/generate",
                    json={"topic": topic, "style": style, "length": length}
                )
                if response.status_code == 200:
                    st.session_state.generated_content = response.json()["content"]
                    st.success("Post erfolgreich generiert!")
                else:
                    st.error("Fehler beim Generieren des Posts")
            except Exception as e:
                st.error(f"Fehler: {str(e)}")
    
    with col2:
        if "generated_content" in st.session_state:
            st.text_area("Generierter Content", st.session_state.generated_content, height=300)
            
            scheduled_time = st.datetime_input("Planen für", datetime.now())
            if st.button("Post planen"):
                try:
                    response = requests.post(
                        f"{st.secrets.api_url}/api/posts/schedule",
                        json={
                            "content": st.session_state.generated_content,
                            "scheduledTime": scheduled_time.isoformat()
                        }
                    )
                    if response.status_code == 200:
                        st.success("Post erfolgreich geplant!")
                    else:
                        st.error("Fehler beim Planen des Posts")
                except Exception as e:
                    st.error(f"Fehler: {str(e)}")

def interaction_manager_page():
    st.header("Interaction Manager")
    
    # Einstellungen
    st.subheader("Automatisierungs-Einstellungen")
    col1, col2 = st.columns(2)
    
    with col1:
        post_frequency = st.slider("Post-Frequenz (Posts pro Woche)", 1, 7, 3)
        interaction_limit = st.slider("Tägliches Interaktionslimit", 10, 100, 30)
    
    with col2:
        target_audience = st.multiselect(
            "Zielgruppe",
            ["Software Development", "Data Science", "AI/ML", "DevOps", "Product Management"]
        )
    
    if st.button("Einstellungen speichern"):
        try:
            response = requests.put(
                f"{st.secrets.api_url}/api/settings",
                json={
                    "postFrequency": post_frequency,
                    "interactionLimit": interaction_limit,
                    "targetAudience": target_audience
                }
            )
            if response.status_code == 200:
                st.success("Einstellungen erfolgreich gespeichert!")
            else:
                st.error("Fehler beim Speichern der Einstellungen")
        except Exception as e:
            st.error(f"Fehler: {str(e)}")

def network_growth_page():
    st.header("Network Growth")
    
    col1, col2 = st.columns(2)
    
    with col1:
        keywords = st.multiselect(
            "Suchbegriffe",
            ["Python", "JavaScript", "React", "Node.js", "Machine Learning", "DevOps"]
        )
        industries = st.multiselect(
            "Zielbranchen",
            ["Technology", "Software", "Data Science", "AI", "Consulting"]
        )
        
        if st.button("Kontakte suchen"):
            try:
                response = requests.post(
                    f"{st.secrets.api_url}/api/network/search",
                    json={"keywords": keywords, "industries": industries}
                )
                if response.status_code == 200:
                    st.session_state.prospects = response.json()
                    st.success("Suche abgeschlossen!")
                else:
                    st.error("Fehler bei der Suche")
            except Exception as e:
                st.error(f"Fehler: {str(e)}")
    
    with col2:
        if "prospects" in st.session_state:
            for prospect in st.session_state.prospects:
                with st.expander(f"{prospect['name']} - {prospect['position']}"):
                    st.write(f"ID: {prospect['id']}")
                    message = st.text_area("Kontaktanfrage Nachricht", key=prospect['id'])
                    if st.button("Kontaktanfrage senden", key=f"btn_{prospect['id']}"):
                        try:
                            response = requests.post(
                                f"{st.secrets.api_url}/api/network/connect",
                                json={"profileId": prospect['id'], "message": message}
                            )
                            if response.status_code == 200:
                                st.success("Kontaktanfrage gesendet!")
                            else:
                                st.error("Fehler beim Senden der Kontaktanfrage")
                        except Exception as e:
                            st.error(f"Fehler: {str(e)}")

# Hauptanwendungslogik - Direkt zum Dashboard
main_dashboard() 