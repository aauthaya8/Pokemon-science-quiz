Drop public-domain / CC0 MP3 files here with these exact names:

  attack-basic.mp3      short whoosh / 8-bit hit
  attack-powered.mp3    bigger zap / 8-bit power-up
  hit.mp3               thud / impact
  wrong.mp3             soft buzzer / "wrong answer" beep
  victory.mp3           short fanfare / level-clear jingle
  defeat.mp3            sad descending tone / game over
  level-unlock.mp3      sparkle / chime
  battle-music.mp3      30-60s loopable chiptune BGM

Suggested free sources (all CC0 / public domain):

  pixabay.com search "8-bit hit"      -> attack-basic, hit
  pixabay.com search "8-bit zap"      -> attack-powered
  pixabay.com search "8-bit fanfare"  -> victory, level-unlock
  pixabay.com search "buzzer"         -> wrong
  pixabay.com search "game over"      -> defeat
  pixabay.com search "chiptune battle"-> battle-music
  freesound.org search "8bit fanfare" -> alt source

The app gracefully ignores missing files (audio.play() rejection is swallowed),
so the rest of the game keeps working even if a file is absent.
