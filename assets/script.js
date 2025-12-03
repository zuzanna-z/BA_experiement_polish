let main_txt_div = document.getElementsByClassName("main_text_container")[0];
const main_button = document.getElementById("button_div");
const download_button = document.getElementById("download_csv");
const upload_button = document.getElementById("upload_csv");
const download_button_ghost = document.getElementById("download_csv_control");
const answer_block = document.getElementById("sub_text_container");
const label = document.getElementById("term_section");
const answer_1 = document.getElementById("answer_1");
const answer_2 = document.getElementById("answer_2");
const answer_3 = document.getElementById("answer_3");
const answer_4 = document.getElementById("answer_4");
const end_form_submit_button = document.getElementById("submit_button_end");
const check_array = document.getElementsByClassName("control_answer_contianer");
const end_form = document.getElementById("info_form_end");
let stage_control;
let time_spent = "NaN";

const alphabet = [
  "A",
  "B",
  "C",
  "D",
  "F",
  "G",
  "H",
  "I",
  "J",
  "K",
  "L",
  "M",
  "N",
  "O",
  "P",
  "R",
  "S",
  "T",
  "U",
  "W",
  "X",
  "Y",
  "Z",
];

let id_form;
let info_form;
let experiment_form = [];
let control_form = [];

// let task_stop = true;

// console.log(intro);

let participantIDnow =
  Math.floor(Math.random() * 9).toString() +
  Math.floor(Math.random() * 9).toString() +
  Math.floor(Math.random() * 9).toString() +
  Math.floor(Math.random() * 9).toString() +
  alphabet[Math.floor(Math.random() * alphabet.length)] +
  alphabet[Math.floor(Math.random() * alphabet.length)];

// console.log(participantIDnow);

document.getElementById("id_part").value = participantIDnow;

window.addEventListener("DOMContentLoaded", (e) => {
  // console.log("page is fully loaded");
  // console.log(main_txt_div);
  main_txt_div.innerText = "";
  main_txt_div.innerText = info_agree_1;
  stage_control = "consent_1";
});

let answer_count = 0;
let trial_count = 0;
let trial_stim_rand_li = [];
let polish_count = 0;
let polish_stim_rand_li = [];
let english_count = 0;
let english_stim_rand_li = [];
let shape_onset_time = null;
let trial_ready = true;

// const get_new_experiment_entry = () =>{

// }

// -----------------------------------------
// MAIN KEYDOWN LISTENER (only one)
// -----------------------------------------
window.addEventListener("keydown", (e) => {
  if (e.repeat) return;
  e.preventDefault();

  // -------------------- INTRO → TRIALS --------------------
  if (e.code === "Space" && stage_control === "consent_1") {
    main_txt_div.innerText = info_agree_2;
    stage_control = "consent_2";


    return;
  }

  if (e.code === "Space" && stage_control === "consent_2") {
    main_txt_div.innerText = "Please fill out the form and press submit. Make sure you check answer for every question.";
    document.getElementById("start_form").classList.toggle("hidden");
    stage_control = "consent_3";
    return;
  }

  // if (e.code === "Space" && stage_control === "consent_4") {
  //   main_txt_div.innerText = instructions_trial;
  //   stage_control = "instructions_trial_intro";
  //   return;
  // }

  // -------------------- STOP RESPONDING AFTER TRIALS --------------------
  // if (stage_control === "practice_trial") {
  //   // only respond to Space now
  //   if (e.code === "Space") {

  //     console.log("Proceeding after practice");
  //   }
  //   return;
  // }

  // -------------------- TRIAL RESPONSE KEYS
  // --------------------
  if (e.code === "Space" && stage_control === "intro") {
    main_txt_div.innerText = instructions_trial;
    stage_control = "instructions_trial_intro";
    return;
  }

  if (
    (stage_control === "instructions_trial" &&
      (e.code === "KeyW" || e.code === "KeyN")) ||
    (stage_control === "instructions_trial_intro" && e.code === "Space")
  ) {
    // prevent double presses during fixation + 500ms window
    if (stage_control === "instructions_trial_intro") {
      stage_control = "instructions_trial";
    }
    if (!trial_ready) {
      // console.log("Ignored press during fixation");
      return;
    }

    // ---------------- EXIT AFTER 50 TRIALS ----------------
    if (trial_count >= 50) {
      stage_control = "practice_trial";
      main_txt_div.innerText = instructions_polish;
      // console.log("Practice over");
      return;
    }

    // ---------------- START TRIAL ----------------
    trial_ready = false;

    // compute RT from previous trial
    let rt;
    let correct_trial;

    if (shape_onset_time !== null) {
      rt = performance.now() - shape_onset_time;
      // console.log(`Trial ${trial_count}: RT = ${rt.toFixed(2)} ms`);
      shape_onset_time = null;
    }

    if (trial_count > 0) {
      if (trial_stim_rand_li[trial_count - 1] === "triangle") {
        if (e.key === "w") {
          correct_trial = 1;
        } else {
          correct_trial = 0;
        }
      }
      if (trial_stim_rand_li[trial_count - 1] === "circle") {
        if (e.key === "n") {
          correct_trial = 1;
        } else {
          correct_trial = 0;
        }
      }

      let new_experiment_entry = {
        id: participantIDnow,
        stimuli: trial_stim_rand_li[trial_count - 1],
        type: "shape",
        reaction_time: rt,
        answer: e.key,
        correct: correct_trial,
        language: "practice",
      };
      experiment_form.push(new_experiment_entry);
      // console.log(new_experiment_entry);
    }

    // fixation cross
    main_txt_div.innerHTML = "<p class='fixation_cross'>+</p>";

    // show shape after 500 ms
    setTimeout(() => {
      const shape_list = [`&#9650;`, `&#9679;`];
      let random_idx = Math.floor(Math.random() * shape_list.length);

      let stim_rand = shape_list[random_idx];

      if (stim_rand === `&#9650;`) {
        trial_stim_rand_li.push("triangle");
      } else {
        trial_stim_rand_li.push("circle");
      }

      main_txt_div.innerHTML = `<p class='control_cond'>${stim_rand}</p>`;

      shape_onset_time = performance.now();
      trial_count++;

      // console.log("trial:", trial_count);

      trial_ready = true;

      if (trial_count >= 50) {
        stage_control = "practice_trial_intro";
        main_txt_div.innerText = instructions_polish;
        // console.log("Practice over");
      }
    }, 500);
  }

  // TRIALS -> POLISH

  if (
    (stage_control === "practice_trial" &&
      (e.code === "KeyW" || e.code === "KeyN")) ||
    (stage_control === "practice_trial_intro" && e.code === "Space")
  ) {
    // prevent double presses during fixation + 500ms window
    if (stage_control === "practice_trial_intro") {
      stage_control = "practice_trial";
    }
    if (!trial_ready) {
      // console.log("Ignored press during fixation");
      return;
    }

    // ---------------- EXIT AFTER 50 TRIALS ----------------
    if (polish_count >= 100) {
      stage_control = "polish_trial";
      main_txt_div.innerText = instructions_english;
      // console.log("polish over");
      return;
    }

    // ---------------- START TRIAL ----------------
    trial_ready = false;

    let rt;
    let correct_pl;

    // compute RT from previous trial
    if (shape_onset_time !== null) {
      rt = performance.now() - shape_onset_time;
      // console.log(`Trial ${trial_count}: RT = ${rt.toFixed(2)} ms`);
      shape_onset_time = null;
    }

    if (polish_count > 0) {
      if (pl_full_shuffeld[polish_count - 1].type === "word") {
        if (e.key === "w") {
          correct_pl = 1;
        } else {
          correct_pl = 0;
        }
      }
      if (pl_full_shuffeld[polish_count - 1].type === "pseudoword") {
        if (e.key === "n") {
          correct_pl = 1;
        } else {
          correct_pl = 0;
        }
      }

      let new_experiment_entry = {
        id: participantIDnow,
        stimuli: pl_full_shuffeld[polish_count - 1].word,
        type: pl_full_shuffeld[polish_count - 1].type,
        reaction_time: rt,
        answer: e.key,
        correct: correct_pl,
        language: "pl",
      };
      experiment_form.push(new_experiment_entry);
      // console.log(new_experiment_entry);
    }

    // fixation cross
    main_txt_div.innerHTML = "<p class='fixation_cross'>+</p>";

    // show shape after 500 ms
    setTimeout(() => {
      main_txt_div.innerHTML = `<p class=''>${pl_full_shuffeld[polish_count].word}</p>`;

      shape_onset_time = performance.now();
      polish_count++;

      // console.log("trial:", polish_count);

      trial_ready = true;

      if (polish_count >= 100) {
        stage_control = "polish_trial_intro";
        main_txt_div.innerText = instructions_english;
        // console.log("Practice over");
      }
    }, 500);
  }

  // POLISH -> ENGLISH

  if (
    (stage_control === "polish_trial" &&
      (e.code === "KeyW" || e.code === "KeyN")) ||
    (stage_control === "polish_trial_intro" && e.code === "Space")
  ) {
    if (stage_control === "polish_trial_intro") {
      stage_control = "polish_trial";
    }
    // prevent double presses during fixation + 500ms window
    if (!trial_ready) {
      // console.log("Ignored press during fixation");
      return;
    }

    // ---------------- EXIT AFTER 50 TRIALS ----------------
    if (english_count >= 100) {
      stage_control = "english_trial";
      main_txt_div.innerText = instructions_control;
      // console.log("english over");
      return;
    }

    // ---------------- START TRIAL ----------------
    trial_ready = false;
    let rt;
    let correct_en;
    // compute RT from previous trial
    if (shape_onset_time !== null) {
      rt = performance.now() - shape_onset_time;
      // console.log(`Trial ${english_count}: RT = ${rt.toFixed(2)} ms`);
      shape_onset_time = null;
    }

    if (english_count > 0) {
      if (en_full_shuffeld[english_count - 1].type === "word") {
        if (e.key === "w") {
          correct_en = 1;
        } else {
          correct_en = 0;
        }
      }
      if (en_full_shuffeld[english_count - 1].type === "pseudoword") {
        if (e.key === "n") {
          correct_en = 1;
        } else {
          correct_en = 0;
        }
      }

      let new_experiment_entry = {
        id: participantIDnow,
        stimuli: en_full_shuffeld[english_count - 1].word,
        type: en_full_shuffeld[english_count - 1].type,
        reaction_time: rt,
        answer: e.key,
        correct: correct_en,
        language: "en",
      };
      experiment_form.push(new_experiment_entry);
      // console.log(new_experiment_entry);
    }

    // fixation cross
    main_txt_div.innerHTML = "<p class='fixation_cross'>+</p>";

    // show shape after 500 ms
    setTimeout(() => {
      main_txt_div.innerHTML = `<p class=''>${en_full_shuffeld[english_count].word}</p>`;
      shape_onset_time = performance.now();
      english_count++;

      // console.log("trial:", english_count);

      trial_ready = true;

      if (english_count >= 100) {
        stage_control = "english_trial";
        main_txt_div.innerText = instructions_control;
        run_control(0);
        answer_count++;

        // console.log("Practice over");
        main_button.classList.toggle("hidden");
      }
    }, 500);
  }
});

let pl_full_dict = [];
pl_words.forEach((word) => {
  let new_entry = {
    word: word,
    type: "word",
  };

  pl_full_dict.push(new_entry);
});

pl_pseudowords.forEach((word) => {
  let new_entry = {
    word: word,
    type: "pseudoword",
  };

  pl_full_dict.push(new_entry);
});

let en_full_dict = [];
en_words.forEach((word) => {
  let new_entry = {
    word: word,
    type: "word",
  };

  en_full_dict.push(new_entry);
});
en_pseudowords.forEach((word) => {
  let new_entry = {
    word: word,
    type: "pseudoword",
  };

  en_full_dict.push(new_entry);
});

pl_full = pl_words.concat(pl_pseudowords);
en_full = en_words.concat(en_pseudowords);

const shuffle_array = (arr) => {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1)); // pick random index
    // swap arr[i] and arr[j]
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
};

pl_full_shuffeld = shuffle_array(pl_full_dict);
en_full_shuffeld = shuffle_array(en_full_dict);

// CONTROL
let term_counter_control = 0;

const run_control = (idx) => {
  // console.log("control_running", idx);
  // console.log(control_set_pl[idx]);

  // console.log(idx);
  item = control_set_pl[idx];
  label.innerText = `Choose translation for: ${item.word}`;
  answers_shuffeled = shuffle_array([
    item.translation,
    item.wrong_1,
    item.wrong_2,
    item.wrong_3,
  ]);

  // console.log(answer_1.childNodes)
  let check_transformed_array = Array.from(
    document.getElementsByClassName("control_answer_contianer")
  );
  check_transformed_array[0].getElementsByTagName("p")[0].innerText =
    answers_shuffeled[0];
  answer_1.dataset.answer = answers_shuffeled[0];
  check_transformed_array[1].getElementsByTagName("p")[0].innerText =
    answers_shuffeled[1];
  answer_2.dataset.answer = answers_shuffeled[1];

  check_transformed_array[2].getElementsByTagName("p")[0].innerText =
    answers_shuffeled[2];
  answer_3.dataset.answer = answers_shuffeled[2];
  check_transformed_array[3].getElementsByTagName("p")[0].innerText =
    answers_shuffeled[3];
  answer_4.dataset.answer = answers_shuffeled[3];
};

let answer_ready = true;
let first_instance = true;
answer_block.addEventListener("click", (e) => {
  console.log("clicked");
  console.log(e.target.tagName);
  console.log(answer_ready);
  let user_answer;
  if (e.target.tagName === "INPUT") {
    // console.log(e.target.dataset.answer)
    user_answer = e.target.dataset.answer;
  } else {
    user_answer = e.target.innerText;
  }
  if (!answer_ready) {
    console.log("false alarm");
    e.target.checked = false;
    return;
  }
  if (first_instance) {
    answer_count--
    first_instance = false;
  }
  if (0 < answer_count < 50) {
    answer_ready = false;
    e.target.checked = true;

    console.log("idx", answer_count);
    console.log("answer", user_answer);
    console.log("word for idx", control_set_pl[answer_count].word);

    let is_correct;
    if (control_set_pl[answer_count].translation === user_answer) {
      is_correct = 1;
    } else {
      is_correct = 0;
    }
    let new_control_entry = {
      id: participantIDnow,
      word: control_set_pl[answer_count].word,
      translation: control_set_pl[answer_count].translation,
      answer: user_answer,
      correct: is_correct,
    };
    control_form.push(new_control_entry);
    console.log("pushed elm:", control_form);
    answer_count++;

    if (answer_count < 50) {
      setTimeout(() => {
        e.target.checked = false;
        answer_ready = true;
        run_control(answer_count);
      }, 300);
    }
  }
  if (answer_count >= 50) {
    control_form.push(new_control_entry);
    stage_control = "end_form";
    answer_block.classList.toggle("hidden");
    main_button.getElementsByTagName("button")[0].innerText = "Start";
    main_button.classList.toggle("hidden");
    main_txt_div.innerText = end_form_instructions;
    main_txt_div.classList.toggle("hidden");
  }
});

const objToCSV = (obj) => {
  let csv = "data:text/csv;charset=utf-8,";
  // console.log(obj)
  // console.log(Object.keys(obj[0]));
  const headers = Object.keys(obj[0]);
  csv += headers.join(",") + "\n";
  obj.forEach((elm) => {
    const values = headers.map((header) => elm[header]);
    csv += values.join(",") + "\n";
  });
  return csv;
};

// BUTTON CONTROLLED
document
  .getElementById("submit_button_start")
  .addEventListener("click", (e) => {
    e.preventDefault();
    document.getElementById("start_form").classList.toggle("hidden");
    stage_control = "consent_4";
    main_txt_div.innerText = instructions_trial;
    stage_control = "instructions_trial_intro";

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    let get_all_start_inputs = document.querySelectorAll(
      "input[class='form_field_start_input_control']"
    );
    let all_checked_start = [];
    Array.from(get_all_start_inputs).forEach((input) => {
      if (input.checked) {
        all_checked_start.push(input);
      }
    });

    // console.log(all_checked_start)
    id_form = [
      {
        id: participantIDnow,
        gender: all_checked_start[0].dataset.value,
        age: document.getElementById("participant_age").value,
        education: all_checked_start[1].dataset.value,
        use_of_en: all_checked_start[2].dataset.value,
      },
    ];

    let not_filled;
    if (
      (id_form[0].fluency_self == "") |
      (id_form.proficiency == "") |
      (id_form.en_speaking == "") |
      (id_form.reading_disability == "")
    ) {
      not_filled = true;
    }

    while (not_filled) {
      document.getElementById("submit_button_start").disabled = true;
    }
    if (!not_filled) {
      document.getElementById("submit_button_start").disabled = false;
    }
  });

main_button.addEventListener("click", (e) => {
  if (stage_control === "english_trial") {
    // console.log("clicked_button");
    main_txt_div.innerText = "";
    main_txt_div.classList.toggle("hidden");
    main_button.classList.toggle("hidden");
    document.getElementById("sub_text_container").classList.toggle("hidden");
    stage_control = "control_condition";
    run_control(0);
  }

  if (stage_control === "end_form") {
    main_txt_div.innerText = "";
    main_txt_div.classList.toggle("hidden");
    end_form.classList.toggle("hidden");
    main_button.classList.toggle("hidden");
  }
});

// download_button.addEventListener("click", (e) => {
//   download_button_ghost.click();
// });

end_form_submit_button.addEventListener("click", (e) => {
  e.preventDefault();
  main_txt_div.innerText = outro;
  stage_control = "data_ready";
  main_txt_div.classList.toggle("hidden");
  end_form.classList.toggle("hidden");
  download_button.classList.toggle("hidden");
  upload_button.classList.toggle("hidden");

  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });

  let get_all_start_inputs = document.querySelectorAll(
    "input[class='form_field_end_input_control']"
  );
  let all_checked_start = [];
  Array.from(get_all_start_inputs).forEach((input) => {
    if (input.checked) {
      all_checked_start.push(input);
    }
  });
  // console.log(all_checked_start)
  if (all_checked_start[2].dataset.value === "yes") {
    time_spent = document.getElementById("question_3_a1b").value;
  }
  info_form = [
    {
      id: participantIDnow,
      fluency_self: all_checked_start[0].dataset.value,
      proficiency: all_checked_start[1].dataset.value,
      en_grade: all_checked_start[2].dataset.value,
      en_speaking: all_checked_start[3].dataset.value,
      en_time_spent: time_spent,
      reading_disability: all_checked_start[4].dataset.value,
    },
  ];
  // console.log(info_form);

  let full_df = [];

  experiment_form.forEach((observation) => {
    if ((observation.language === "en") & (observation.type === "word")) {
      let match_control_idx = control_set_pl
        .map((elm) => elm["word"])
        .indexOf(observation.stimuli);
      console.log(`stim: ${observation.stimuli}`);
      console.log(`idx: ${match_control_idx}`);
      console.log(`word at idx: ${control_form[match_control_idx].word}`);
      new_full_entry = {
        id: participantIDnow,
        gender: id_form[0].gender,
        age: id_form[0].age,
        education: id_form[0].education,
        use_of_en: id_form[0].use_of_en,
        fluency_self: info_form[0].fluency_self,
        proficiency: info_form[0].proficiency,
        en_grade: info_form[0].en_grade,
        en_speaking_country: info_form[0].en_speaking,
        en_time_spent: info_form[0].time_spent,
        reading_disability: info_form[0].reading_disability,
        stimuli: observation.stimuli,
        type: observation.type,
        reaction_time: observation.reaction_time,
        answer: observation.answer,
        correct: observation.correct,
        control_word: control_form[match_control_idx].word,
        control_answer: control_form[match_control_idx].answer,
        control_translation: control_form[match_control_idx].translation,
        control_correct: control_form[match_control_idx].correct,
        language: observation.language,
      };
      full_df.push(new_full_entry);
    } else {
      new_full_entry = {
        id: participantIDnow,
        gender: id_form[0].gender,
        age: id_form[0].age,
        education: id_form[0].education,
        use_of_en: id_form[0].use_of_en,
        fluency_self: info_form[0].fluency_self,
        proficiency: info_form[0].proficiency,
        en_grade: info_form[0].en_grade,
        en_speaking_country: info_form[0].en_speaking,
        en_time_spent: info_form[0].time_spent,
        reading_disability: info_form[0].reading_disability,
        stimuli: observation.stimuli,
        type: observation.type,
        reaction_time: observation.reaction_time,
        answer: observation.answer,
        correct: observation.correct,
        control_word: "no_control",
        control_answer: "no_control",
        control_translation: "no_control",
        control_correct: "no_control",
        language: observation.language,
      };
      full_df.push(new_full_entry);
    }
  });
  console.log(new_full_entry);

  let full_csv = objToCSV(full_df);
  let control_csv = objToCSV(control_form);
  console.log(full_csv);
  // console.log(control_csv);

  let encURI = encodeURI(full_csv);
  let encURI_control = encodeURI(control_csv);

  download_button.setAttribute("href", encURI);
  download_button.setAttribute("download", `${participantIDnow}_data.csv`);

  // download_button_ghost.setAttribute("href", encURI_control);
  // download_button_ghost.setAttribute(
  //   "download",
  //   `${participantIDnow}_data_control.csv`
  // );
});

const all_fields = document.getElementsByClassName("form_field_start");
// const inputs_all = document.querySelectorAll("input[type='radio']");

const keepFormClean = (inputs_collection) => {
  let elements_arr = Array.from(inputs_collection);
  elements_arr.forEach((elm) => {
    let all_inputs = Array.from(elm.querySelectorAll("input[type='radio']"));
    all_inputs.forEach((input) => {
      input.addEventListener("click", (e) => {
        // console.log(e.target);
        // console.log(e.target.checked);
        all_inputs.forEach((arr_itm) => {
          arr_itm.checked = false;
        });

        e.target.checked = true;

        if (e.target.id === "question_3_a1") {
          document
            .getElementById("english_country_yes")
            .classList.toggle("hidden");
        }
        if (
          (e.target.id === "question_3_a2") &
          !document
            .getElementById("english_country_yes")
            .classList.contains("hidden")
        ) {
          document
            .getElementById("english_country_yes")
            .classList.toggle("hidden");
        }
      });
    });
  });
};

keepFormClean(all_fields);

document.getElementById("participant_age").addEventListener(
  "keydown",
  (e) => {
    // console.log("INPUT EVENT from:", e.target);
    // console.log("INPUT key", e.key);
    if (e.code === "Backspace") {
      e.target.value = e.target.value.substring(0, e.target.value.length - 1);
    } else {
      e.target.value = e.target.value + e.key;
    }
  },
  { capture: true }
);

