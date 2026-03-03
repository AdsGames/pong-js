import { screen } from "allegro-ts";
import "allegro-ts/global";

const font_80: FONT = {
  element: null,
  file: "",
  name: "Arial",
  size: 80,
  type: "fnt",
};

const font_40: FONT = {
  element: null,
  file: "",
  name: "Arial",
  size: 40,
  type: "fnt",
};

const font_30: FONT = {
  element: null,
  file: "",
  name: "Arial",
  size: 30,
  type: "fnt",
};

const font_20: FONT = {
  element: null,
  file: "",
  name: "Arial",
  size: 20,
  type: "fnt",
};

const font_10: FONT = {
  element: null,
  file: "",
  name: "Arial",
  size: 10,
  type: "fnt",
};

const BALL_RADIUS = 16;
let ball_max_velocity = 7;
let ball_x = 480;
let ball_y = 400;
let ball_velocity_x = -3;
let ball_velocity_y = 0;

let pong: SAMPLE;
let die: SAMPLE;
let win: SAMPLE;

const PADDLE_WIDTH = 16;
const PADDLE_HEIGHT = 100;
const PADDLE_SPEED = 4;
const paddle_human_x = 880;
let paddle_human_y = 200;

const paddle_cpu_x = 80 - 16;
let paddle_cpu_y = 400;

let game_state = 0;
let cpu_player = true;

let cpu_score = 0;
let human_score = 0;

// Collision between two given boxes
function collision(
  xMin1: number,
  xMax1: number,
  xMin2: number,
  xMax2: number,
  yMin1: number,
  yMax1: number,
  yMin2: number,
  yMax2: number
) {
  if (xMin1 < xMax2 && yMin1 < yMax2 && xMin2 < xMax1 && yMin2 < yMax1) {
    return true;
  }
  return false;
}

function draw() {
  if (game_state === 1) {
    rectfill(
      screen.value,
      SCREEN_W.value / 2 - 1,
      0,
      SCREEN_W.value / 2 + 1,
      SCREEN_H.value,
      makecol(255, 255, 255)
    );

    rectfill(
      screen.value,
      ball_x,
      ball_y,
      ball_x + 16,
      ball_y + 16,
      makecol(255, 255, 255)
    );
    rectfill(
      screen.value,
      paddle_human_x,
      paddle_human_y,
      paddle_human_x + PADDLE_WIDTH,
      paddle_human_y + PADDLE_HEIGHT,
      makecol(255, 255, 255)
    );
    rectfill(
      screen.value,
      paddle_cpu_x,
      paddle_cpu_y,
      paddle_cpu_x + PADDLE_WIDTH,
      paddle_cpu_y + PADDLE_HEIGHT,
      makecol(255, 255, 255)
    );

    textout_centre_ex(
      screen.value,
      font_40,
      cpu_score.toString(),
      SCREEN_W.value / 2 - 40,
      50,
      makecol(255, 255, 255),
      -1
    );
    textout_centre_ex(
      screen.value,
      font_40,
      human_score.toString(),
      SCREEN_W.value / 2 + 40,
      50,
      makecol(255, 255, 255),
      -1
    );
  }
  if (game_state === 0) {
    textout_centre_ex(
      screen.value,
      font_80,
      "PONG",
      SCREEN_W.value / 2,
      100,
      makecol(255, 255, 255),
      -1
    );

    textout_centre_ex(
      screen.value,
      font_20,
      "Press 1 for singleplayer",
      SCREEN_W.value / 2,
      600,
      makecol(255, 255, 255),
      -1
    );
    textout_centre_ex(
      screen.value,
      font_20,
      "Press 2 for multiplayer",
      SCREEN_W.value / 2,
      630,
      makecol(255, 255, 255),
      -1
    );

    textout_ex(
      screen.value,
      font_10,
      "2017 ADS Games",
      10,
      700,
      makecol(255, 255, 255),
      -1
    );
    textout_ex(
      screen.value,
      font_10,
      "Danny Van Stemp",
      10,
      712,
      makecol(255, 255, 255),
      -1
    );

    textout_ex(
      screen.value,
      font_30,
      "UP/DOWN for",
      700,
      400,
      makecol(255, 255, 255),
      -1
    );
    textout_ex(
      screen.value,
      font_30,
      "player 1",
      700,
      440,
      makecol(255, 255, 255),
      -1
    );

    textout_ex(
      screen.value,
      font_30,
      "W/S for",
      50,
      400,
      makecol(255, 255, 255),
      -1
    );
    textout_ex(
      screen.value,
      font_30,
      "player 2",
      50,
      440,
      makecol(255, 255, 255),
      -1
    );
  }
}

function restart_game(isPlayerPoint: boolean) {
  ball_x = SCREEN_W.value / 2;
  ball_y = SCREEN_H.value / 2;
  ball_velocity_y = 0;
  ball_max_velocity = 7;

  if (isPlayerPoint) {
    ball_velocity_x = -3;
    human_score++;
    play_sample(win, 255, 127, 1000, false);
  } else {
    ball_velocity_x = 3;
    cpu_score++;
    play_sample(die, 255, 127, 1000, false);
  }
}

function update() {
  if (game_state === 1) {
    if (key[KEY_UP]) {
      paddle_human_y -= PADDLE_SPEED;
    }

    if (key[KEY_DOWN]) {
      paddle_human_y += PADDLE_SPEED;
    }

    if (cpu_player) {
      if (ball_y < paddle_cpu_y + 20) {
        paddle_cpu_y -= PADDLE_SPEED;
      }
      if (ball_y > paddle_cpu_y + 20) {
        paddle_cpu_y += PADDLE_SPEED;
      }
    } else {
      if (key[KEY_W]) {
        paddle_cpu_y -= PADDLE_SPEED;
      }
      if (key[KEY_S]) {
        paddle_cpu_y += PADDLE_SPEED;
      }
    }

    if (paddle_human_y < 1) {
      paddle_human_y = 1;
    }

    if (paddle_human_y > SCREEN_H.value - PADDLE_HEIGHT - 1) {
      paddle_human_y = SCREEN_H.value - PADDLE_HEIGHT - 1;
    }

    if (paddle_cpu_y < 1) {
      paddle_cpu_y = 1;
    }

    if (paddle_cpu_y > SCREEN_H.value - PADDLE_HEIGHT - 1) {
      paddle_cpu_y = SCREEN_H.value - PADDLE_HEIGHT - 1;
    }

    ball_x += ball_velocity_x;
    ball_y += ball_velocity_y;

    if (ball_x <= 0) {
      restart_game(true);
    }
    if (ball_x >= SCREEN_W.value - BALL_RADIUS) {
      restart_game(false);
    }

    if (ball_y <= 0) {
      ball_velocity_y = -ball_velocity_y;
    }

    if (ball_y >= SCREEN_H.value - BALL_RADIUS) {
      ball_velocity_y = -ball_velocity_y;
    }

    if (
      collision(
        ball_x,
        ball_x + BALL_RADIUS,
        paddle_human_x,
        paddle_human_x + PADDLE_WIDTH,
        ball_y,
        ball_y + BALL_RADIUS,
        paddle_human_y,
        paddle_human_y + PADDLE_HEIGHT
      )
    ) {
      ball_velocity_y = -((PADDLE_HEIGHT / 2 + (paddle_human_y - ball_y)) / 5);
      if (ball_velocity_y > ball_max_velocity * 0.7) {
        ball_velocity_y = ball_max_velocity * 0.7;
      }
      if (ball_velocity_y < -(ball_max_velocity * 0.7)) {
        ball_velocity_y = -(ball_max_velocity * 0.7);
      }
      ball_velocity_x = Math.sqrt(
        ball_max_velocity ** 2 - ball_velocity_y ** 2
      );

      if (!cpu_player) {
        ball_max_velocity += 0.5;
      }

      play_sample(pong, 255, 127, 1000, false);

      ball_velocity_x = -ball_velocity_x;
    }

    if (
      collision(
        ball_x,
        ball_x + BALL_RADIUS,
        paddle_cpu_x,
        paddle_cpu_x + PADDLE_WIDTH,
        ball_y,
        ball_y + BALL_RADIUS,
        paddle_cpu_y,
        paddle_cpu_y + PADDLE_HEIGHT
      )
    ) {
      ball_velocity_y = -((PADDLE_HEIGHT / 2 + (paddle_cpu_y - ball_y)) / 5);
      if (ball_velocity_y > ball_max_velocity * 0.7) {
        ball_velocity_y = ball_max_velocity * 0.7;
      }
      if (ball_velocity_y < -(ball_max_velocity * 0.7)) {
        ball_velocity_y = -(ball_max_velocity * 0.7);
      }
      ball_velocity_x = Math.sqrt(
        ball_max_velocity ** 2 - ball_velocity_y ** 2
      );

      if (!cpu_player) {
        ball_max_velocity += 0.5;
      }

      play_sample(pong, 255, 127, 1000, false);
    }

    if (human_score > 99) {
      human_score = 99;
    }

    if (cpu_score > 99) {
      cpu_score = 99;
    }
  }
  if (game_state === 0) {
    if (key[KEY_1]) {
      game_state = 1;
    }

    if (key[KEY_2]) {
      game_state = 1;
      cpu_player = false;
    }
  }
}

async function setup() {
  pong = await load_sample("assets/audio/pong.wav");
  die = await load_sample("assets/audio/die.wav");
  win = await load_sample("assets/audio/win.wav");
}

async function main() {
  const running = true;
  enable_debug("debug");

  if (allegro_init() !== 0) {
    allegro_message("Error initialising Allegro\n%s\n", allegro_error);
    return 1;
  }

  if (set_gfx_mode(GFX_AUTODETECT, 960, 720, 0, 0) !== 0) {
    allegro_message("Error setting graphics mode\n%s\n", allegro_error);
    return 1;
  }

  if (install_mouse() !== 0) {
    allegro_message("Error initialising mouse\n%s\n", allegro_error);
    return 1;
  }

  if (install_keyboard() !== 0) {
    allegro_message("Error initialising keyboard\n%s\n", allegro_error);
    return 1;
  }

  if (allegro_init() !== 0) {
    allegro_message("Error initialising Allegro\n%s\n", allegro_error);
    return 1;
  }

  if (install_sound(DIGI_AUTODETECT, MIDI_NONE, null) !== 0) {
    allegro_message("Error initialising sound system\n%s\n", allegro_error);
    return 1;
  }

  await setup();

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition, no-unmodified-loop-condition
  while (running) {
    clear_to_color(screen.value, makecol(0, 0, 0));
    update();
    draw();

    await rest(16);
  }

  return 0;
}
END_OF_MAIN();

init_allegro_ts("game-canvas", main);
