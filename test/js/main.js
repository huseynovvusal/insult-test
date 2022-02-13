class Question {
  constructor() {
    this.index = 0;
    this.questionsElement = document.querySelector(".container");
    this.point = 0;
    this.message =
      "Sizin insult keçirmə ehtimalınız çoxdur. Mütləq həkimə müraciət etməlisiniz.";
  }

  async getData() {
    const res = await fetch("questions.json");
    let data = await res.json();
    return data;
  }

  variantSelected(e, point) {
    this.point += point;
    e.classList.add("active");
    this.questionsElement.classList.add("disable");
    if (this.index < 7) {
      setTimeout(() => {
        this.update();
      }, 1000);
    } else {
      this.questionsElement.classList.add("finish");
      let finish = document.querySelector("button");
      this.questionsElement.classList.remove("disable");
      finish.addEventListener("click", (e) => {
        this.getResult(e);
      });
    }
  }

  getResult(e) {
    if (this.point >= 0 && this.point <= 8) {
      this.message =
        "Sizin insult keçirmə ehtimalınız çox aşağıdır. Risk müşahidə olunmur.";
    }
    if (this.point > 8 && this.point <= 16) {
      this.message =
        "Sizdə insult keçirmə ehtimalı müşahidə olunur. Tam əmin olmaq üçün həkimə müraciət edib, yoxlanışdan keçə bilərsiniz.";
    }

    this.alert_(this.message);
  }

  alert_(msg) {
    let alertElement = document.createElement("div");
    let a = document.createElement("a");
    a.href = "../index.html";
    a.textContent = "Ana Səhifə";
    alertElement.className = "alert";
    alertElement.textContent = msg;
    alertElement.appendChild(a);
    this.questionsElement.appendChild(alertElement);
  }

  update() {
    this.index++;
    this.loadQuestions();
    this.questionsElement.classList.remove("disable");
  }

  loadQuestions() {
    this.getData()
      .then((d) => {
        let data = d[this.index];

        const q = `
        <div class='question'>${data.question}</div>
        <div class='answers'>
          <div class='answer'>${data.answers[0].answer}</div>
          <div class='answer'>${data.answers[1].answer}</div>
          <div class='answer'>${data.answers[2].answer}</div>
        </div>
        <button class='finish'>Nəticə</button>
        `;

        this.questionsElement.innerHTML = q;

        let answers = document.querySelectorAll(".answer");

        answers.forEach((ans, key) => {
          ans.setAttribute(
            "onClick",
            `question_.variantSelected(this,${data.answers[key].point})`
          );
        });
      })
      .catch((err) => console.error(err));
  }
}

const question_ = new Question();

question_.loadQuestions();
