// Add a new game by copying an entry below and changing the values.
// archiveId comes from the archive.org URL, e.g. archive.org/details/<archiveId>
const GAMES = [
  {
    title: "Science Adventure II",
    category: "science",
    archiveId: "scienceadventureii",
    blurb: "Explore Stonehenge, a human skull, a roller coaster's physics, and more with Isaac Asimov."
  },
  {
    title: "Math Rabbit",
    category: "early",
    archiveId: "msdos_Math_Rabbit_1986",
    blurb: "Four gentle counting and matching games starring Math Rabbit at the circus."
  },
  {
    title: "Reader Rabbit",
    category: "reading",
    archiveId: "reader_rabbit_1_dos",
    blurb: "The original Reader Rabbit \u2014 letter and word games in Reader Rabbit's storybook world."
  },
  {
    title: "Reader Rabbit 2",
    category: "reading",
    archiveId: "msdos_Reader_Rabbit_2_1991",
    blurb: "Collect words for Word-Ville through Vowel Pond, Word Mine, Word Patch, and Alphabet Dance."
  },
  {
    title: "Reader Rabbit 3",
    category: "reading",
    archiveId: "msdos_Reader_Rabbit_3_1993",
    blurb: "Help Reader Rabbit write the town newspaper by building sentences piece by piece."
  },
  {
    title: "Reader Rabbit's Ready for Letters",
    category: "early",
    archiveId: "msdos_Reader_Rabbits_Ready_for_Letters_1992",
    blurb: "Six gentle activities for the youngest learners \u2014 letters, sounds, patterns, and more."
  },
  {
    title: "JumpStart 2nd Grade",
    category: "science",
    archiveId: "SIG_WIN",
    blurb: "Join C.J. the Frog through the Clubhouse, Classroom, and more for science, spelling, and math."
  },
  {
    title: "Mavis Beacon Teaches Typing",
    category: "reading",
    archiveId: "msdos_Mavis_Beacon_Teaches_Typing_1987",
    blurb: "Learn touch typing lesson by lesson, then race the clock in an arcade typing challenge."
  },
  {
    title: "Super Solvers: Challenge of the Ancient Empires",
    category: "logic",
    archiveId: "msdos_Super_Solvers_Challenge_of_the_Ancient_Empires_1990",
    blurb: "Explore ancient Greece, Egypt, India, China, and the Near East to recover hidden treasures."
  },
  {
    title: "Treasure MathStorm!",
    category: "math",
    archiveId: "msdos_Super_Solvers_Treasure_MathStorm_1992",
    blurb: "Solve math riddles to free Treasure Mountain from the Master of Mischief's icy machine."
  },
  {
    title: "Treasure Cove!",
    category: "math",
    archiveId: "msdos_Super_Solvers_Treasure_Cove_1994",
    blurb: "Answer reading and math questions from friendly starfish to restore the cove's rainbow bridge."
  },
  {
    title: "Super Solvers: OutNumbered!",
    category: "math",
    archiveId: "msdos_Super_Solvers_OutNumbered_1990",
    blurb: "Crack the case by solving arithmetic problems and gathering clues around Shady Glen School."
  },
  {
    title: "Super Solvers: Midnight Rescue!",
    category: "logic",
    archiveId: "msdos_Super_Solvers_Midnight_Rescue_1989",
    blurb: "Read clues and solve riddles to catch the Master of Mischief before the school disappears."
  },
  {
    title: "Super Solvers: Gizmos & Gadgets",
    category: "science",
    archiveId: "msdos_Super_Solvers_Gizmos_and_Gadgets_1993",
    blurb: "Learn simple machines and basic physics by building vehicles to race Morty Maxwell."
  },
  {
    title: "Super Munchers: The Challenge Continues",
    category: "logic",
    archiveId: "msdos_Super_Munchers_-_The_Challenge_Continues..._1991",
    blurb: "Munch words that fit the category \u2014 covering science, geography, history, and more."
  },
  {
    title: "Number Munchers",
    category: "math",
    archiveId: "msdos_Number_Munchers_1990",
    blurb: "Chomp the numbers that match the clue \u2014 watch out for Troggles!"
  },
  {
    title: "Word Munchers",
    category: "reading",
    archiveId: "Word_Munchers_v1.4_1985_MECC",
    blurb: "Same tasty game, but now you're munching words and letters."
  },
  {
    title: "Oregon Trail Deluxe",
    category: "adventure",
    archiveId: "msdos_Oregon_Trail_Deluxe_The_1992",
    blurb: "Pack your wagon and head west. Watch out for the river crossings!"
  },
  {
    title: "Where in the World is Carmen Sandiego?",
    category: "adventure",
    archiveId: "msdos_Where_in_the_World_is_Carmen_Sandiego_Deluxe_1990",
    blurb: "Track down sneaky thieves by following geography clues around the globe."
  },
  {
    title: "Mario Teaches Typing",
    category: "reading",
    archiveId: "msdos_Mario_Teaches_Typing_1992",
    blurb: "Type the right keys to help Mario jump, run, and stomp Koopas."
  },
  {
    title: "Treasure Mountain",
    category: "logic",
    archiveId: "msdos_Super_Solvers_Treasure_Mountain_1990",
    blurb: "Solve riddles to collect keys and treasure on your way up the mountain."
  },
  {
    title: "Reader Rabbit",
    category: "reading",
    archiveId: "msdos_Reader_Rabbit_1989",
    blurb: "Play word and letter games with Reader Rabbit and friends."
  },
  {
    title: "Mixed-Up Mother Goose",
    category: "reading",
    archiveId: "msdos_Mixed-Up_Mother_Goose_1991",
    blurb: "Nursery rhyme characters have lost their things \u2014 explore and set the stories right."
  },
  {
    title: "Castle of Dr. Brain",
    category: "logic",
    archiveId: "msdos_Castle_of_Dr._Brain_1991",
    blurb: "Work through a castle full of brain-teasing puzzles and riddles."
  },
  {
    title: "Island of Dr. Brain",
    category: "logic",
    archiveId: "msdos_Island_of_Dr._Brain_1992",
    blurb: "Even trickier puzzles await on Dr. Brain's mysterious island."
  },
  {
    title: "Eagle Eye Mysteries",
    category: "logic",
    archiveId: "msdos_Eagle_Eye_Mysteries_1993",
    blurb: "Team up with detectives Jake and Jennifer Eagle to crack neighborhood mysteries."
  },
  {
    title: "Odell Lake",
    category: "science",
    archiveId: "a2_Odell_Lake_v1.2_1986_MECC_US",
    blurb: "Swim as a fish in Odell Lake \u2014 eat, hide, or flee to survive!"
  },
  {
    title: "Kindercomp",
    category: "early",
    archiveId: "zx_Kindercomp_1984_Spinnaker_Software_a",
    blurb: "Six friendly mini-games for learning the keyboard, drawing, and matching."
  },
  {
    title: "Lemonade Stand",
    category: "math",
    archiveId: "Lemonade_Stand_1979_Apple",
    blurb: "Run your own lemonade stand \u2014 set prices and watch the weather!"
  },
  {
    title: "Putt-Putt Joins the Parade",
    category: "adventure",
    archiveId: "PUTTPUTT-DOS",
    blurb: "Help Putt-Putt find a pet, a balloon, and a car wash so he can join the town parade."
  },
  {
    title: "Putt-Putt and Fatty Bear's Activity Pack",
    category: "early",
    archiveId: "ACTIVITYPACK",
    blurb: "A collection of coloring pages, mini-games, and activities starring Putt-Putt and Fatty Bear."
  },
  {
    title: "SimCity Classic",
    category: "sim",
    archiveId: "msdos_SimCity_Classic_1994",
    blurb: "Build and manage your own city \u2014 zone neighborhoods, build roads, and keep your citizens happy."
  },
  {
    title: "Fatty Bear's Birthday Surprise",
    category: "adventure",
    archiveId: "msdos_Fatty_Bears_Birthday_Surprise_1993",
    blurb: "Help Fatty Bear gather cake ingredients and party supplies for Kayla's surprise birthday party."
  },
  {
    title: "Paddle Ball",
    category: "arcade",
    canvasGame: "pong",
    icon: "\ud83c\udfd3",
    blurb: "A 2-player paddle-and-ball game \u2014 one player uses W/S, the other uses the arrow keys."
  },
  {
    title: "Grow the Line",
    category: "arcade",
    canvasGame: "snake",
    icon: "\ud83d\udc0d",
    blurb: "Guide your line around the board to eat food and grow \u2014 don't hit the walls or yourself!"
  },
  {
    title: "Brick Breaker",
    category: "arcade",
    canvasGame: "breakout",
    icon: "\ud83e\uddf1",
    blurb: "Bounce the ball with your paddle to clear every brick. Use the arrow keys or your mouse."
  }
];
