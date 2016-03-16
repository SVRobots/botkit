/*~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~
           ______     ______     ______   __  __     __     ______
          /\  == \   /\  __ \   /\__  _\ /\ \/ /    /\ \   /\__  _\
          \ \  __<   \ \ \/\ \  \/_/\ \/ \ \  _"-.  \ \ \  \/_/\ \/
           \ \_____\  \ \_____\    \ \_\  \ \_\ \_\  \ \_\    \ \_\
            \/_____/   \/_____/     \/_/   \/_/\/_/   \/_/     \/_/


This is a sample Slack bot built with Botkit.

This bot demonstrates many of the core features of Botkit:

* Connect to Slack using the real time API
* Receive messages based on "spoken" patterns
* Reply to messages
* Use the conversation system to ask questions
* Use the built in storage system to store and retrieve information
  for a user.

# RUN THE BOT:

  Get a Bot token from Slack:

    -> http://my.slack.com/services/new/bot

  Run your bot from the command line:

    token=<MY TOKEN> node bot.js

# USE THE BOT:

  Say: "Something?"

  The bot will randomly reply "YES!" or "NO!"

  Say: "QRT"

  The bot will ask if you are sure, and then shut itself down.

  Make sure to invite your bot into other channels using /invite @<my bot>!

~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~*/


if (!process.env.token) {
    console.log('Error: Specify token in environment');
    process.exit(1);
}


var Botkit = require('./lib/Botkit.js');
var os = require('os');

var controller = Botkit.slackbot({
    debug: true,
});

var bot = controller.spawn({
    token: process.env.token
}).startRTM();

var yesImoji = [
    'simple_smile',
    'heart_eyes',
    'thumbsup',
    'heart',
    'grinning',
    'smiley',
    'smile',
    'joy',
    'sweat_smile',
    'smirk',
    'wink',
    'nerd_face',
    'clap',
    'ok_hand',
    'cool',
    'troll'
    
];

var noImoji = [
    'joy',
    'sweat_smile',
    'laughing',
    'unamused',
    'face_with_rolling_eyes',
    'flushed',
    'disappointed',
    'worried',
    'angry',
    'rage',
    'slightly_frowning_face',
    'white_frowning_face',
    'persevere',
    'confounded',
    'open_mouth',
    'scream',
    'fearful',
    'cold_sweat',
    'cry',
    'disappointed_relieved',
    'sob',
    'thumbsdown',
    'rage2',
    'troll'
];

var silentImoji = [
    'confused',
    'grimacing',
    'expressionless',
    'thinking_face',
    'zipper_mouth_face',
    'neutral_face',
    'no_mouth'
];

controller.hears(['(.*)'],'ambient',function(bot, message) {

        if(message.match[1].slice(-1) === "?")
        {
            if(Math.floor(Math.random() * (101 - 0) + 0) != 42)
            {
                if(Math.floor(Math.random() * (2 - 0) + 0) === 1)
                {
                    bot.api.reactions.add({
                        timestamp: message.ts,
                        channel: message.channel,
                        name: yesImoji[Math.floor(Math.random() * (yesImoji.length - 0) + 0)],
                    },function(err, res) {
                        if (err) {
                            bot.botkit.log('Failed to add emoji reaction :(',err);
                        }
                    });
                    bot.reply(message, "YES!" );
                }
                else
                {
                bot.api.reactions.add({
                        timestamp: message.ts,
                        channel: message.channel,
                        name: noImoji[Math.floor(Math.random() * (noImoji.length - 0) + 0)],
                    },function(err, res) {
                        if (err) {
                            bot.botkit.log('Failed to add emoji reaction :(',err);
                        }
                    });
                    bot.reply(message, "NO!" );
                }
            }
            else
            {
                bot.api.reactions.add({
                    timestamp: message.ts,
                    channel: message.channel,
                    name: silentImoji[Math.floor(Math.random() * (silentImoji.length - 0) + 0)],
                },function(err, res) {
                    if (err) {
                        bot.botkit.log('Failed to add emoji reaction :(',err);
                    }
                });
            }
        }
});

controller.hears(['QRT'],'direct_message,direct_mention,mention',function(bot, message) {

    bot.startConversation(message,function(err, convo) {

        convo.ask('QRT QSL?',[
            {
                pattern: bot.utterances.yes,
                callback: function(response, convo) {
                    convo.say('Bye!');
                    convo.next();
                    setTimeout(function() {
                        process.exit();
                    },3000);
                }
            },
        {
            pattern: bot.utterances.no,
            default: true,
            callback: function(response, convo) {
                convo.say('*Phew!*');
                convo.next();
            }
        }
        ]);
    });
});


controller.hears(['uptime','identify yourself','who are you','what is your name'],'direct_message,direct_mention,mention',function(bot, message) {

    var hostname = os.hostname();
    var uptime = formatUptime(process.uptime());

    bot.reply(message,':robot_face: I am a bot named <@' + bot.identity.name + '>. I have been running for ' + uptime + ' on ' + hostname + '.');

});

function formatUptime(uptime) {
    var unit = 'second';
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'minute';
    }
    if (uptime > 60) {
        uptime = uptime / 60;
        unit = 'hour';
    }
    if (uptime != 1) {
        unit = unit + 's';
    }

    uptime = uptime + ' ' + unit;
    return uptime;
}
