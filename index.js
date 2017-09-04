var natural = require("natural");
var path = require("path");

var base_folder = path.join(path.dirname(require.resolve("natural")), "brill_pos_tagger");
var rulesFilename = base_folder + "/data/English/tr_from_posjs.txt";
var lexiconFilename = base_folder + "/data/English/lexicon_from_posjs.json";
var defaultCategory = 'N';

var lexicon = new natural.Lexicon(lexiconFilename, defaultCategory);
var rules = new natural.RuleSet(rulesFilename);
var tagger = new natural.BrillPOSTagger(lexicon, rules);

var tokenizer = new natural.WordTokenizer();


var classifier = new natural.BayesClassifier();



var issues = [
    {text: "no problem all good", result: 0},
    {text: "everything is broken, please help me", result : 1},
    {text: "whatever", result: 0},
    {text: "love this company", result: 0},
    {text: "good", result: 0},
    {text: "bad", result:1},
    {text: "terrible", result:1},
    {text: "nice", result: 0}
]

issues.forEach(function(issue) {
    var filteredTokens = getFilteredTokens(tokenizer, tagger, issue.text);
    classifier.addDocument(filteredTokens, issue.result);
})

classifier.train();
console.log(classifier.getClassifications(process.argv[2]));


function getFilteredTokens(tokenizer, tagger, text) {
    var tokens = tokenizer.tokenize(text);
    
    var taggedTokens = tagger.tag(tokens);
    //console.log(JSON.stringify(taggedTokens))
    
    var filteredTokens = [];
    taggedTokens.forEach(function(token) {
        if (keepToken(token[1])) {
            filteredTokens.push(token[0]);
        }
    }, this);
    
    return filteredTokens;    
}


function keepToken(tokenCategorie) {
    interestingCategories = ['N', 'NN', 'NNS', 'VB', 'VBP', 'VBZ', 'JJ'];
    return interestingCategories.indexOf(tokenCategorie) > -1;
}


