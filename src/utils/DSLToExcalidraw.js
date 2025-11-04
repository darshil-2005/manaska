

const DSLSrcipt = `Node "discrete_speech_processing" {
  label: "Discrete Speech Processing",
  height: 200,
  width: 400,
  x: 1000,
  y: 500,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "speech_signal" {
  label: "Speech Signal",
  height: 200,
  width: 400,
  x: 920.9504875811344,
  y: 769.8160243669846,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "digitization" {
  label: "Digitization",
  height: 200,
  width: 400,
  x: 708.7972519791791,
  y: 954.3167480579416,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "feature_extraction" {
  label: "Feature Extraction",
  height: 200,
  width: 400,
  x: 430.62273252381124,
  y: 995.163402078079,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "quantization" {
  label: "Quantization",
  height: 200,
  width: 400,
  x: 174.38516973622717,
  y: 879.440354090461,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "speech_units" {
  label: "Speech Units",
  height: 200,
  width: 400,
  x: 19.692959599523874,
  y: 638.9429629082933,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "pattern_recognition" {
  label: "Pattern Recognition",
  height: 200,
  width: 400,
  x: 20.650958578165728,
  y: 357.78714373176877,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "applications" {
  label: "Applications",
  height: 200,
  width: 400,
  x: 173.17818956819406,
  y: 121.5987523460359,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "speech_recognition" {
  label: "Speech Recognition",
  height: 200,
  width: 400,
  x: 429.0458396081633,
  y: 5.0600974632480415,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "speaker_identification" {
  label: "Speaker Identification",
  height: 200,
  width: 400,
  x: 707.3490567803909,
  y: 45.02047446914469,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};

Node "speech_synthesis" {
  label: "Speech Synthesis",
  height: 200,
  width: 400,
  x: 920.0889065966126,
  y: 228.8444900901651,
  backgroundColor: "#3bc9db",
  borderColor: "#000000",
  textColor: "#000000",
};
Connection "H7MDLj2M7tQyGm3" {
  source: "discrete_speech_processing",
  target: "speech_signal",
  relation: "processes",
};

Connection "CnOINOuuLBDz8I5" {
  source: "speech_signal",
  target: "digitization",
  relation: "converted_by",
};

Connection "PGQtPQCKfCIGqkX" {
  source: "digitization",
  target: "feature_extraction",
  relation: "enables",
};

Connection "3aWa0mSsGUVmA5b" {
  source: "feature_extraction",
  target: "quantization",
  relation: "followed_by",
};

Connection "M4wqUQdxdDNwrlS" {
  source: "quantization",
  target: "speech_units",
  relation: "produces",
};

Connection "zLyMlnYMT6lWDn0" {
  source: "speech_units",
  target: "pattern_recognition",
  relation: "used_in",
};

Connection "WcLJOBANDlo9G1x" {
  source: "pattern_recognition",
  target: "applications",
  relation: "applied_in",
};

Connection "43Q1w00wOVdfd3M" {
  source: "applications",
  target: "speech_recognition",
  relation: "includes",
};

Connection "GJc7jIMGk8FQSef" {
  source: "applications",
  target: "speaker_identification",
  relation: "includes",
};

Connection "6JiWowlT3dysPqg" {
  source: "applications",
  target: "speech_synthesis",
  relation: "includes",
};`;

function processElement(element) {

    const type = element.split(" ")[0].trim();

    const name = element.split("\"")[1].trim();

    const propertiesString = element.split("{")[1].split("}")[0].split(",").map(d => d.trim()).filter(Boolean);
    const properties = [];

    for (let i = 0; i < propertiesString.length; i++) {

        const splitString = propertiesString[i].split(":")

        const key = splitString[0].trim();
        const value = splitString[1].trim();

        properties.push({key, value});
    }

    return {type, name, properties};
}


function DSLToExcalidraw(DSLSrcipt) {

    const elements = DSLSrcipt.split(";").filter(Boolean);

    const processedElements = [];

    for (let i = 0; i < elements.length; i++) {
        const processedElement = processElement(elements[i]);
        processedElements.push(processedElement);
    }

    console.log(processedElements);
};


DSLToExcalidraw(DSLSrcipt);