import Alexa, { SkillBuilders } from "ask-sdk-core";
import { ExpressAdapter } from "ask-sdk-express-adapter";
import morgan from "morgan";
import cors from "cors";
import express from "express";
import axios from "axios";

const app = express();
const PORT = process.env.PORT || 8000;
app.use(morgan("dev"));

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "LaunchRequest"
    );
  },
  handle(handlerInput) {
    const speakOutput =
      "Hi, I'm story Teller. You can ask me for a specific or random story.";

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(`Hi, I'm Story Teller. Are you looking for a specific or random story?`)
      .getResponse();
  },
};

const random_IntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === "IntentRequest" &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === "random_Intent"
    );
  },
  handle(handlerInput) {
    const slots = handlerInput.requestEnvelope.request.intent.slots;

    const time = slots.time;
    console.log("Random intent time");

    const speakOutput = "random intent hit";

    return (
      handlerInput.responseBuilder
        .speak(speakOutput)
        //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
        .getResponse()
    );
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    const speakOutput =
      "Sorry, I had trouble doing what you asked. Please try again.";
    console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

    return handlerInput.responseBuilder
      .speak(speakOutput)
      .reprompt(speakOutput)
      .getResponse();
  },
};

const SkillBuilder = SkillBuilders.custom()
  .addRequestHandlers(LaunchRequestHandler, random_IntentHandler)
  .addErrorHandlers(ErrorHandler);

const skill = SkillBuilder.create();
const adapter = new ExpressAdapter(skill, true, true);

// https://hotel-booking-alexa-api.herokuapp.com/
app.post("/api/v1/webhook-alexa", adapter.getRequestHandlers());

app.use(express.json());
app.use(cors());

app.get("/test",(req,res)=>{
    res.send("Alexa test Server")
});

app.get("/",(req,res)=>{
  res.send("Express Server form Alexa")
})

app.listen(PORT, () => {
  console.log(`Server is upon running on port ${PORT}`);
});