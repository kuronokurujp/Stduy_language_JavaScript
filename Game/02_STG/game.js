/**
 * 初期セットアップ
 * ゲーム開始前に一度だけ呼ばれる
 */
var OBJ_MAX = 100;

var timer = 0;
var g_game_view = null;

/**
 * ゲームのView
 */
class GameView
{
    constructor(in_width, in_height)
    {
        this._width = in_width;
        this._height = in_height;
        canvasSize(this._width, this._height);

        this._bg = new BG(in_width);
        this._ship_automa_col = "black";
        this._ship = new Ship();
        this._missle_mng = new MissleManager(OBJ_MAX);
        this._enemy_mng = new EnemyManager(OBJ_MAX);
        this._effect_mng = new EffectManager(OBJ_MAX);
    }

    Init()
    {
        loadImg(0, "image/bg.png");
        loadImg(1, "image/spaceship.png");
        loadImg(2, "image/missile.png");
        loadImg(3, "image/enemy0.png");
        loadImg(4, "image/enemy1.png");
        loadImg(EffectExploed.sImgNo(), EffectExploed.sImgFilePath());

        this._bg.Init(0, 0, 0);
        this._bg.SetSpeedScroll(1);
        this._ship.Init(
            this._width * 0.05, this._height / 2, 1, 10, this._missle_mng, this._effect_mng);
        this._missle_mng.Init(
            this._width, this._height, this._effect_mng);
        this._enemy_mng.Init(
            this._width, this._height, this._missle_mng, this._effect_mng);

        // TEST: 敵を出してみる
        {
            this._enemy_mng.Create(this._width * 0.5, 100, "e01");
            this._enemy_mng.Create(this._width * 0.5, 300, "e01");
            this._enemy_mng.Create(this._width * 0.5, 500, "e01");
        }
    }

    Update(in_timer)
    {
        this._bg.Update(in_timer);
        this._ship.Update(in_timer, this._width, this._height);
        this._missle_mng.Update(in_timer, this._width);
        this._enemy_mng.Update(in_timer);
        this._effect_mng.Update(in_timer);
        {
            this._ship_automa_col = "black";
            if (this._ship._automa === 1)
            {
                this._ship_automa_col = "white";
            }
        }

        // ヒット判定処理
        {
            // 敵とミサイルとのヒット判定
            let missle_obj_array = this._missle_mng.ToArray();
            let enemy_obj_array = this._enemy_mng.ToArray();
            let ship_obj_array = [this._ship];
            CheckHitPawnObjectArrayToPaanObjectArray(
                missle_obj_array, enemy_obj_array);
            CheckHitPawnObjectArrayToPaanObjectArray(
                ship_obj_array, enemy_obj_array);
            CheckHitPawnObjectArrayToPaanObjectArray(
                ship_obj_array, missle_obj_array);
        }
    }

    Draw()
    {
        this._bg.Draw();
        this._ship.Draw();
        this._missle_mng.Draw();
        this._enemy_mng.Draw();
        this._effect_mng.Draw();

        let rect_w = 280;
        fRect(this._width - rect_w, 20, rect_w, 60, "blue");
        fText("[A]uto Missile", 1040, 50, 36, this._ship_automa_col);

        // 自機のエネルギー表記
        {
            let energy_y_pos = this._height * 0.9;
            let energy_x_pos = 20;
            for (let i = 0; i < this._ship.MaxEnergy; ++i)
                fRect(energy_x_pos + i * 30, energy_y_pos, 20, 40, "#c00000");

            for (let i = 0; i < this._ship.NowEnergy; ++i)
                fRect(energy_x_pos + i * 30, energy_y_pos, 20, 40, colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
        }
    }
}

function setup()
{
    g_game_view = new GameView(1200, 720);

    setFPS(60);

    g_game_view.Init();
}

/**
 * メイン処理
 */
function mainloop()
{
    timer += 1;
    g_game_view.Draw();
    g_game_view.Update(timer);
}