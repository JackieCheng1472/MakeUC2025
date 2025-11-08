import streamlit as st

def parse_lines(lines):
    parsed = []
    for line in lines:
        line = line.strip()
        if "|" in line:
            question, answer = [s.strip() for s in line.split("|", 1)]
        elif line.lower().startswith("q:") and "a:" in line.lower():
            q_match = line.lower().find("q:")
            a_match = line.lower().find("a:")
            question = line[q_match + 2:a_match].strip()
            answer = line[a_match + 2:].strip()
        elif ":" in line:
            question, answer = [s.strip() for s in line.split(":", 1)]
        elif "," in line:
            question, answer = [s.strip() for s in line.split(",", 1)]
        else:
            continue
        if question and answer:
            parsed.append({'question': question, 'answer': answer})
    return parsed

st.title("Flashcard Study App")

uploaded_file = st.file_uploader("Upload your flashcard file (.txt, .csv)", type=["txt", "csv"])
cards = []
if uploaded_file:
    text = uploaded_file.read().decode("utf-8")
    lines = text.split("\n")
    cards = parse_lines(lines)

if not cards:
    st.info("Upload a valid file with formats: Question|Answer, Q: Question A: Answer, Question: Answer or Question,Answer")
else:
    st.success(f"Found {len(cards)} cards!")
    # session state for flipping and navigation
    if "index" not in st.session_state:
        st.session_state.index = 0
    if "flipped" not in st.session_state:
        st.session_state.flipped = False

    card = cards[st.session_state.index]
    st.markdown(f"### Card {st.session_state.index + 1} of {len(cards)}")
    if st.session_state.flipped:
        st.write("**Answer**")
        st.write(card['answer'])
    else:
        st.write("**Question**")
        st.write(card['question'])

    col1, col2, col3 = st.columns([1, 1, 1])
    with col1:
        if st.button("Previous", disabled=st.session_state.index == 0):
            st.session_state.index -= 1
            st.session_state.flipped = False
    with col2:
        if st.button("Flip"):
            st.session_state.flipped = not st.session_state.flipped
    with col3:
        if st.button("Next", disabled=st.session_state.index == len(cards)-1):
            st.session_state.index += 1
            st.session_state.flipped = False

    st.divider()
    if st.button("Shuffle"):
        import random
        random.shuffle(cards)
        st.session_state.index = 0
        st.session_state.flipped = False
