"use strict";

// const { readFileSync, writeFileSync } = require("fs");
const Question = use("App/Models/Question");
const OpenAI = require("openai");

const openai = new OpenAI({
  apiKey: "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", // This is the default and can be omitted
});

class QuestionController {
  async index({ response }) {
    const question = await Question.query()
      .select("id", "question", "option_a", "option_b", "option_c", "option_d")
      .fetch();
    return response.json(question);
  }

  async store({ request, response }) {
    const { command } = request.only(["command"]);
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    function parseQuestions(inputString) {
      const questions = inputString.split("\n\n");
      const questionObjects = [];

      for (let i = 0; i < questions.length; i++) {
        if (i % 2 === 0) {
          const parts = questions[i].split("\n");
          const indexof = parts[0].indexOf(" ");
          const questionText = parts[0].substring(indexof + 1);
          const options = {};
          let answer = "";
          for (let j = 1; j < parts.length; j++) {
            if (parts[j].startsWith("Answer:")) {
              answer = parts[j].substring(8).trim();
            } else {
              const optionLetter = parts[j].substring(3, 4);
              const optionText = parts[j].substring(6).trim();
              options[optionLetter] = optionText;
            }
          }
          const formatted = {
            questionNumber: i,
            question: questionText,
            options: options,
          };
          questionObjects.push(formatted);
        } else {
          const answerOptions = {};
          const answerWithOptionLetter = questions[i].substring(8).trim();
          const optionLetter = answerWithOptionLetter.substring(0, 1);
          const aswer = answerWithOptionLetter.substring(3);
          answerOptions[optionLetter] = aswer;
          const each = questionObjects.find(
            (each) => each.questionNumber == i - 1
          );
          each["answer"] = answerOptions;
        }
      }
      return questionObjects;
    }

    const chatCompletion = await openai.chat.completions.create({
      messages: [
        {
          role: "user",
          content:
            command +
            ' the output come with the following format `1) What is JavaScript primarily used for?\n   a) Styling web pages\n   b) Adding interactivity to websites\n   c) Creating databases\n   d) Writing server-side code\n\nAnswer: b) Adding interactivity to websites\n\n2) Which keyword is used to declare a variable in JavaScript?\n   a) var\n   b) let\n   c) const\n   d) all of the above\n\nAnswer: d) all of the above\n\n3) Which function is used to display a message in the browser console?\n   a) prompt()\n   b) alert()\n   c) confirm()\n   d) console.log()\n\nAnswer: d) console.log()\n\n4) Which data type is used to represent true/false values?\n   a) string\n   b) boolean\n   c) number\n   d) array\n\nAnswer: b) boolean\n\n5) What is the correct syntax for a comment in JavaScript?\n   a) <!-- This is a comment -->\n   b) // This is a comment\n   c) /* This is a comment */\n   d) <!--! This is a comment -->\n\nAnswer: b) // This is a comment\n\n6) How would you access the fifth element in an array named "myArray"?\n   a) myArray[4]\n   b) myArray[5]\n   c) myArray[1]\n   d) myArray[0]\n\nAnswer: a) myArray[4]\n\n7) Which built-in method in JavaScript is used to return the character at a specified index of a string?\n   a) charAt()\n   b) indexOf()\n   c) slice()\n   d) toUpperCase()\n\nAnswer: a) charAt()\n\n8) What is the result of the following code snippet: console.log(2 + "2");\n   a) 22\n   b) 4\n   c) "22"\n   d) "2 + 2"\n\nAnswer: c) "22"\n\n9) Which operator is used to concatenate two strings together?\n   a) +\n   b) *\n   c) /\n   d) -\n\nAnswer: a) +\n\n10) What does the isNaN() function in JavaScript do?\n   a) Checks if a value is not a string\n   b) Checks if a value is null or undefined\n   c) Checks if a value is not a number\n   d) Checks if a value is not an object\n\nAnswer: c) Checks if a value is not a number`',
        },
      ],
      model: "gpt-3.5-turbo",
    });

    const questionsArray = parseQuestions(
      chatCompletion.choices[0].message.content
    );

    console.log(questionsArray);

    Promise.all(
      questionsArray.map(async (eachQuestion) => {
        const data = {
          question: eachQuestion.question,
          option_a: eachQuestion.options.a,
          option_b: eachQuestion.options.b,
          option_c: eachQuestion.options.c,
          option_d: eachQuestion.options.d,
          answer_option: Object.keys(eachQuestion.answer)[0],
          answer: Object.values(eachQuestion.answer)[0],
        };

        await Question.create(data);
      })
    );
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    //////////////////////////////////////////////////////////////////////////////////////
    // await Question.create({
    //   question: "eachQuestion.question",
    //   option_a: "eachQuestion.options.",
    //   option_b: "eachQuestion.options.b",
    //   option_c: "eachQuestion.options.c",
    //   option_d: "eachQuestion.options.",
    //   answer_option: "Object.keys(eachQuestion.answer)[0",
    //   answer: "Object.values(eachQuestion.answer)[0]",
    // });
    return response
      .status(201)
      .json({ message: "questions saved to database" });
  }
  // async store({ request, response }) {
  //   ///////////////////////////////////////////////////
  //   ///////////////////////////////////////////////////
  //   function parseQuestions(inputString) {
  //     const questions = inputString.split("\n\n");
  //     const questionObjects = [];

  //     for (let i = 0; i < questions.length; i++) {
  //       if (i % 2 === 0) {
  //         const parts = questions[i].split("\n");
  //         const indexof = parts[0].indexOf(" ");
  //         const questionText = parts[0].substring(indexof + 1);
  //         const options = {};
  //         let answer = "";
  //         for (let j = 1; j < parts.length; j++) {
  //           if (parts[j].startsWith("Answer:")) {
  //             answer = parts[j].substring(8).trim();
  //           } else {
  //             const optionLetter = parts[j].substring(3, 4);
  //             const optionText = parts[j].substring(6).trim();
  //             options[optionLetter] = optionText;
  //           }
  //         }
  //         const formatted = {
  //           questionNumber: i,
  //           question: questionText,
  //           options: options,
  //         };
  //         questionObjects.push(formatted);
  //       } else {
  //         const answerOptions = {};
  //         const answerWithOptionLetter = questions[i].substring(8).trim();
  //         const optionLetter = answerWithOptionLetter.substring(0, 1);
  //         const aswer = answerWithOptionLetter.substring(3);
  //         answerOptions[optionLetter] = aswer;
  //         const each = questionObjects.find(
  //           (each) => each.questionNumber == i - 1
  //         );
  //         each["answer"] = answerOptions;
  //       }
  //     }
  //     return questionObjects;
  //   }

  //   const inputString = `1) What is JavaScript primarily used for?\n   a) Styling web pages\n   b) Adding interactivity to websites\n   c) Creating databases\n   d) Writing server-side code\n\nAnswer: b) Adding interactivity to websites\n\n2) Which keyword is used to declare a variable in JavaScript?\n   a) var\n   b) let\n   c) const\n   d) all of the above\n\nAnswer: d) all of the above\n\n3) Which function is used to display a message in the browser console?\n   a) prompt()\n   b) alert()\n   c) confirm()\n   d) console.log()\n\nAnswer: d) console.log()\n\n4) Which data type is used to represent true/false values?\n   a) string\n   b) boolean\n   c) number\n   d) array\n\nAnswer: b) boolean\n\n5) What is the correct syntax for a comment in JavaScript?\n   a) <!-- This is a comment -->\n   b) // This is a comment\n   c) /* This is a comment */\n   d) <!--! This is a comment -->\n\nAnswer: b) // This is a comment\n\n6) How would you access the fifth element in an array named \"myArray\"?\n   a) myArray[4]\n   b) myArray[5]\n   c) myArray[1]\n   d) myArray[0]\n\nAnswer: a) myArray[4]\n\n7) Which built-in method in JavaScript is used to return the character at a specified index of a string?\n   a) charAt()\n   b) indexOf()\n   c) slice()\n   d) toUpperCase()\n\nAnswer: a) charAt()\n\n8) What is the result of the following code snippet: console.log(2 + \"2\");\n   a) 22\n   b) 4\n   c) \"22\"\n   d) \"2 + 2\"\n\nAnswer: c) \"22\"\n\n9) Which operator is used to concatenate two strings together?\n   a) +\n   b) *\n   c) /\n   d) -\n\nAnswer: a) +\n\n10) What does the isNaN() function in JavaScript do?\n   a) Checks if a value is not a string\n   b) Checks if a value is null or undefined\n   c) Checks if a value is not a number\n   d) Checks if a value is not an object\n\nAnswer: c) Checks if a value is not a number`;

  //   const questionsArray = parseQuestions(inputString);
  //   ///////////////////////////////////////////////////
  //   ///////////////////////////////////////////////////

  //   // const mapped = questionsArray.map((eachQuestion) => {
  //   //   return {
  //   //     question: eachQuestion.question,
  //   //     option_a: eachQuestion.options.a,
  //   //     option_b: eachQuestion.options.b,
  //   //     option_c: eachQuestion.options.c,
  //   //     option_d: eachQuestion.options.d,
  //   //     answer_option: Object.keys(eachQuestion.answer)[0],
  //   //     answer: Object.values(eachQuestion.answer)[0],
  //   //   };
  //   // });
  //   // console.log(mapped);
  //   Promise.all(
  //     questionsArray.map(async (eachQuestion) => {
  //       const data = {
  //         question: eachQuestion.question,
  //         option_a: eachQuestion.options.a,
  //         option_b: eachQuestion.options.b,
  //         option_c: eachQuestion.options.c,
  //         option_d: eachQuestion.options.d,
  //         answer_option: Object.keys(eachQuestion.answer)[0],
  //         answer: Object.values(eachQuestion.answer)[0],
  //       };

  //       await Product.create(data);
  //     })
  //   );
  //   return response.status(201).json("product");
  // }

  async show({ params, response }) {
    const question = await Question.find(params.id);
    if (!question) {
      return response.status(404).json({ message: "Question not found" });
    }
    return response.json(question);
  }

  async update({ params, request, response }) {
    const question = await Question.find(params.id);
    if (!question) {
      return response.status(404).json({ message: "Question not found" });
    }
    const data = request.only(["name", "price"]);
    question.merge(data);
    await question.save();
    return response.json(question);
  }

  async destroy({ params, response }) {
    const question = await Question.find(params.id);
    if (!question) {
      return response.status(404).json({ message: "Question not found" });
    }
    await question.delete();
    return response
      .status(204)
      .json({ message: "Question deleted successfully" });
  }

  async compare({ params, request, response }) {
    const questionId = params.id * 1;
    const { answer } = request.body;
    const question = await Question.find(questionId);
    if (!question) {
      return response.status(404).json({ message: "Question not found" });
    }
    const { answer_option } = question;
    if (answer_option === answer) {
      return response.json({ message: "correct" });
    } else {
      return response.json({ message: "incorrect" });
    }
  }
}

module.exports = QuestionController;
