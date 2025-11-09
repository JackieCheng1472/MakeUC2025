import streamlit as st
import re

def parse_lines(lines):
    parsed = []
    for line in lines:
        line = line.strip()
        if line.lower().startswith("q:") and "a:" in line.lower():
            match = re.match(r"q:\s*(.*?)\s*a:\s*(.*)", line, re.IGNORECASE)
            if match:
                question = match.group(1).strip()
                answer = match.group(2).strip()
                if question and answer:
                    parsed.append({"question": question, "answer": answer})
        elif "|" in line:
            question, answer = [s.strip() for s in line.split("|", 1)]
            if question and answer:
                parsed.append({"question": question, "answer": answer})
        elif ":" in line:
            question, answer = [s.strip() for s in line.split(":", 1)]
            if question and answer:
                parsed.append({"question": question, "answer": answer})
        elif "," in line:
            question, answer = [s.strip() for s in line.split(",", 1)]
            if question and answer:
                parsed.append({"question": question, "answer": answer})
    return parsed

st.title("Flashcard Study App")

uploaded_file = st.file_uploader("Upload your flashcard file (.txt, .csv)", type=["txt", "csv"])
if uploaded_file:
    text = uploaded_file.read().decode("utf-8")
    cards = parse_lines(text.split("\n"))
    st.session_state['cards'] = cards
    st.session_state['index'] = 0
    st.session_state['flipped'] = False

if 'cards' in st.session_state and st.session_state['cards']:
    total_cards = len(st.session_state['cards'])
    index = st.session_state.get('index', 0)
    flipped = st.session_state.get('flipped', False)

    # Clamp index so it can't go out of bounds
    index = max(0, min(index, total_cards - 1))
    st.session_state['index'] = index

    card = st.session_state['cards'][index]

    st.markdown(f"### Card {index + 1} of {total_cards}")
    if flipped:
        st.write("**Answer**")
        st.write(card['answer'])
    else:
        st.write("**Question**")
        st.write(card['question'])

    col1, col2, col3 = st.columns(3)
    with col1:
        if st.button("Previous"):
            st.session_state['index'] = max(0, index - 1)
            st.session_state['flipped'] = False
    with col2:
        if st.button("Flip"):
            st.session_state['flipped'] = not flipped
    with col3:
        if st.button("Next"):
            st.session_state['index'] = min(total_cards - 1, index + 1)
            st.session_state['flipped'] = False

    st.divider()
    if st.button("Shuffle"):
        import random
        random.shuffle(st.session_state['cards'])
        st.session_state['index'] = 0
        st.session_state['flipped'] = False

else:
    st.info("Upload a valid file to see your flashcards.")
