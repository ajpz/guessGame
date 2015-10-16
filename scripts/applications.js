(function(){
	/* IIFE BLOCK */
$(document).ready(function() {

	/* GLOBAL VARIABLES */
	var YESNO_INPUTS = 	['y', 'n', 'yes', 'no', 'Yes', 'No', 'Y', 'N'],
		YES_INPUTS = 	['y', 'yes', 'Yes', 'Y'], 
		NUMBER_OF_GUESSES = 5, 
		DELAY_DFLT = 10, //delay between typewriter key strokes [ms]
		OPENING_MSG = 	'Good morning. Would you like to play a game? (y or n)'
		REQ_YESNO_MSG = "Please answer either 'y' or 'n'",
		REQ_INT_MSG = 	'Please respond with an integer from 1 to 100',
		STARTGAME_MSG = 'Alright then. I\'ve selected an integer, from 1 to 100. '+
				   		'You have ' + NUMBER_OF_GUESSES + ' attempts to guess my number. ' +
				   		'And don\'t worry, I\'ll provide hints along the way.',
		WAITFORGAME_MSG = 	'Oh. I was rather hoping for a spirited game. ' +
		   		  			'I suppose I can wait. Let me know when you are ready. ' + 
				  			'Just enter \'y\' when you are ready.',
		RESTART_YES_MSG = 	'You are good at this! Go ahead, please enter your first guess.'; 
		RESTART_NO_MSG = 	'Ok, I\'m tired myself. Ping me with a \'y\' if you change your mind.';
		YOU_WON_MSG = 		'You did it! Would you like to play again?',
		REP_GUESS_MSG = 	'You\'ve already guessed that. I\'m afraid it won\'t be closer the second time.' +
							' I won\'t count it against you.',
		DUMP_CORE_MSG = 	'OH NO... THIS WILL HURT --------------->CORE DUMP................ '; 
		CAT_PIC_MSG = 	'Is this boring you? I apologize, but please try and maintain focus. ' +
						'Now close the cat pics, and lets get back to the task at hand.';
		FEEDBACK_ELT = 	"<li class='feedback'><h3> </h3></li>",			
		PROMPT_ELT = 	"<li class='prompt'><h3> </h3></li>",
		CATFOLDER_ELT = "<div class='cat-folder clicked' id='cats'><a href=#>Close</a><img src='assets/IMG_6920.jpg' alt='picture of calico cat'><img src='assets/IMG_8107.JPG' alt='white cat with leg up'><img src='assets/IMG_8839.JPG' alt='calico cat eating'><img src='assets/IMG_6889.JPG' alt='gray brown cat in tall grass'></div>";

	/*******************************
	Game Constructor and .prototype definitions
	********************************/
	function Game() {
		this.target = Math.ceil(Math.random() * 100); 
		this.userGuess = []; 
		this.hotOrCold = ['extremely hot', 'hot', 'warm', 'cool', 'just plain cold'];
	  	this.warnings = ['',
	  		" Only 1 guess left...!!! PLEASE TRY YOUR BEST!",
	  		" Now only 2 guesses... I SHOULD HAVE TOLD YOU THE STAKES WERE HIGH. IT WASN\'T FAIR OF ME TO WITHOLD INFORMATION.",
	  		" 3 guesses to go... MUCH RIDES ON THE OUTCOME OF THIS GAME. IF YOU DON'T SUCCEED, IT'S LIGHTS OUT FOR ME.",
	  		''];
	  this.state = 'start'; 
	};

	// Initializes the game
	Game.prototype.startGame = function() {
		machSays((arguments[0]||OPENING_MSG), 60); 
	};

	// Resets game to starting state, message displayed depends on whether
	// the game is rebooting, being replayed or paused
	Game.prototype.resetGame = function (msg, state) {
		$('li').remove(); 
		myGame = new Game(); 
		myGame.startGame(msg);
		myGame.state = state; 
	};

	// Types help to the terminal. Output is specific to myGame.state
	Game.prototype.giveHelp = function () {   
		if (myGame.state === 'coreDumped') {
			alert('Seems that the remote server froze. Maybe try to Force Reboot it?');
			return; 			
		}

		makeInputPerm($('.terminal input').last(), ''); 
		var msg; 
		switch (myGame.state) {
			case 'start':
			case 'startOver': 
				msg = 'If you\'d like to play, just enter \'y\'.';
				break; 
			case '1to100': 
				msg = 'W.O.P.R.s target value is between '+(this.target-1)+' and '+(this.target+1);
				break; 
		};
		setTimeout(function () {
			machSays(msg); 
		}, 250);
	}

	// initialize a new instance of Game and call .startGame method
	var myGame = new Game;
	setTimeout(myGame.startGame, 1250); 



 	/****************************
	/*JS Functions     
	/***************************/

	// Did the user enter good input? Expected input is specific to myGame.state
	function goodInput(userSaid) { 
		switch (myGame.state) {
			case 'start':
			case 'startOver':  
				return YESNO_INPUTS.indexOf(userSaid) !== -1 ? (YES_INPUTS.indexOf(userSaid) !== -1 ? 'y': 'n') : false;
				break; 
			case '1to100':
				return (userSaid >= 1 && userSaid <= 100 && userSaid%1 ===0) ? Number(userSaid) : false; 
				break;  
			default: 
				alert("myGame as faulty state variable"); 
				break; 
		};
	}; 

	// Replaces input block with <p> block to "write" user input to terminal
	function makeInputPerm($obj, userSaid) {
		$obj.before('<p>'+userSaid+'</p>');
		$obj.remove();  
	}

	// Simulates a really fast typist. If user has used up 5 guesses, just displays message without typing effect. 
	// Writes new prompt in all game states except 'coredDumped'
	function typeWriter(message, delay) {
		var $el = $('.terminal li').last().find('h3');
		if (myGame.state === 'coreDumped') {
			$el.text(message); 
			return;	
		}
		var counter = 0; 
		var myTimer = setInterval(function() {
			counter++; 
			if (counter <= message.length) {
				$el.text(message.slice(0,counter));
			} else {
				clearInterval(myTimer); 
			}
		}, delay);
		setTimeout(writePrompt, message.length * delay + 500);
	}
	
	// Writes a message in the terminal by adding a new .feedback element
	function machSays(message, delay) {
		$('.terminal').append(FEEDBACK_ELT);
		typeWriter(message, (delay||DELAY_DFLT)); 
	}

	// Writes a new .prompt element to the terminal, and adds focus
	function writePrompt() {
		$('.terminal').append("<li class='prompt'><h3>W.O.P.R.: ~ unknown_user $</h3><input type='text' placeholder=''/></li>");
		$('.prompt input').focus(); 
	}

	// create coreDump string of random characters
	function createCoreDump () {
		var coreDump = ''; 
		for (var i = 0, randNum; i < 2000; i ++) {
			randNum = Math.floor(Math.random() * (122-48+1)); 
			coreDump += String.fromCharCode(randNum);
		}
		return coreDump; 
	}

	// Major game logic and flow, separated into three myGame.state groups: 'start', '1to100', 'startOver'
	// Each myGame.state expects a certain type of user input (y or no, integer from 1 to 100)
	// Takes 1 argument: validated user response of either y, n, integer or false. 
	function next (response) {
		// If invalid user response, query again
		if (!response) {
			(myGame.state === 'start' || myGame.state === 'startOver') ? machSays(REQ_YESNO_MSG) : machSays(REQ_INT_MSG);
			return;
		}

		switch (myGame.state) {		
			case 'start' :
				if (response === 'y') {
					myGame.state = '1to100'; 
					machSays(STARTGAME_MSG);
				} else {
					machSays(WAITFORGAME_MSG); 
				};
				break; 
			
			case '1to100' :
				console.log('entered ', myGame.state, 'guess is ', response, 'target is ', myGame.target); 		
				// Did user guess correctly? 
				if (response === myGame.target) {
					myGame.state = 'startOver'; 
					machSays(YOU_WON_MSG); 
					return; 
				};
				// Did user repeat a guess? 
				if (myGame.userGuess.indexOf(response) !== -1) {
					machSays(REP_GUESS_MSG); 
					return; 
				};
				// Is user out of guesses? 
				myGame.userGuess.push(response);
				var remGuesses = NUMBER_OF_GUESSES - myGame.userGuess.length;
				if (remGuesses === 0) {
					myGame.state = 'coreDumped'; 
					machSays(DUMP_CORE_MSG); 
					var finalMsg = function() {
						machSays(createCoreDump());  
						writePrompt(); 
						makeInputPerm($('.terminal input').last(),' n/a'); 
					}; 
					setTimeout(finalMsg, 1250); 
					return; 
				};
				// Give the user a bit of guidance
				var diff = response - myGame.target,
					absDiff = Math.abs(diff),
					warning = (myGame.warnings[remGuesses]||""), 
					direction,
					idx; 
				diff <=0 ? direction = 'higher' : direction = 'lower'; 
				absDiff < 5 ? idx = 0 : absDiff < 10 ? idx = 1 : absDiff < 15 ? idx = 2 : absDiff < 25 ? idx = 3 : idx = 4; 
				machSays("You are " + myGame.hotOrCold[idx]+ ". You should guess " + direction + '. ' + 
						(warning ? warning : ('You have ' + remGuesses + ' guesses remaining.')));
				break; 
			
			case 'startOver' :
				if (response === 'y') {
					myGame.resetGame(RESTART_YES_MSG, '1to100'); 
					return; 
				}
				myGame.resetGame(RESTART_NO_MSG, 'start'); 
				break; 

			default: 
				alert('myGame.state is corrupted');
				break; 
		}
	}

 	/****************************
	/*EVENT HANDLERS
	/***************************/

	//Resets entire site to starting state
	$('#reset').on('dblclick', function callReset() {
		myGame.resetGame(OPENING_MSG, 'start'); 
	});

	//Provides hint as an alert dialogue box
	$('#hint').on('dblclick', function callGiveHelp() {
		myGame.giveHelp();
	});

	//Opens "window" with cat pics, writes message to terminal
	$('#cat-pics').on('dblclick', function createCatFolder() {
		$('#wrapper').prepend(CATFOLDER_ELT); 
		makeInputPerm($('.terminal input').last(), ''); 
		setTimeout(function () {
			machSays(CAT_PIC_MSG); 
		}, 1500); 
	});

	//Closes cat picture folder
	$('#wrapper').on('click', 'a', function closeCatFolder() {
		$('.cat-folder').remove();
	});

	//Brings terminal to front when clicked on
	$('#wrapper .terminal').on('click', function highlightTerminal() {
		$('.clicked').removeClass('clicked'); 
		$(this).addClass('clicked'); 
	});
	//Brings catFolder to front when clicked on -- THIS DOESN'T WORK
	$('#cats').on('click', function highlightCatFolder() {
		$('.clicked').removeClass('clicked'); 
		$(this).addClass('clicked'); 
	});

	//keyup bubbles up to .terminal, which then looks for 'input'
	//ensures that dynamically created 'input' fields are bound to
	//event handler. 
	$('.terminal').on('keyup', 'input', function (event) {
		if (event.keyCode === 13) {
			var userSaid = $(this).val(); 
			var response = goodInput(userSaid);
			makeInputPerm($(this), userSaid);
			next(response); 
		}
	}); 

});

})();


