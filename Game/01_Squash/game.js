/**
 * ゲームフィールド
 */
class Field
{
    Init(in_size_w, in_size_h)
    {
        this._size_w = in_size_w;
        this._size_h = in_size_h;
    }

    HitFieldLeftLine(in_val)
    {
        if (in_val <= (this._size_w * 0.2))
            return true;

        return false;
    }

    HitFieldRightLine(in_val)
    {
        if (in_val >= (this._size_w * 0.8))
            return true;

        return false;
    }

    HitFieldTopLine(in_val)
    {
        if (in_val <= (this._size_h * 0.075))
            return true;

        return false;
    }

    Draw()
    {
        setAlp(50);
        var x = this._size_w * 0.2;
        var y = this._size_h * 0.0625;
        var w = this._size_w * 0.58;
        var h = this._size_h * 0.9375;
        fRect(x, y, w, h, "black");
        setAlp(100);
        sRect(x, y, w, h, "sliver");
    }
}

/**
 * ボールクラス
 */
class Ball
{
    constructor()
    {
        this._x = 0;
        this._y = 0;
        this._x_vec = 0;
        this._y_vec = 0;
    }

    Init(in_x, in_y)
    {
        this._x = in_x;
        this._y = in_y;
        this.SetXVec(10);
        this.SetYVec(8);
    }

    SetXVec(in_val)
    {
        this._x_vec = in_val;
    }

    SetYVec(in_val)
    {
        this._y_vec = in_val;
    }

    Move()
    {
        this._x = this._x + this._x_vec;
        this._y = this._y + this._y_vec;
    }

    Draw()
    {
        sCir(this._x, this._y, 10, "lime");
    }
}

/**
 * プレイヤーバー
 */
class PlayerBar
{
    constructor()
    {
        this._x = 600;
        this._y = 700;
    }

    Init(in_x, in_y)
    {
        this._x = in_x;
        this._y = in_y;
    }

    SetX(in_val)
    {
        this._x = in_val;
    }

    SetY(in_val)
    {
        this._y = in_val;
    }

    GetX(in_offset_type)
    {
        var x = this._x;
        if (in_offset_type == 1)
            return x - 60;
        else if (in_offset_type == 2)
            return x + 60;

        return x;
    }

    GetY(in_offset_type)
    {
        var y = this._y;
        if (in_offset_type == 1)
            return y - 30;
        else if (in_offset_type == 2)
            return y + 30;

        return y;
    }

    Draw()
    {
        fRect(this._x - 50, this._y - 10, 100, 20, "violet");
    }
}

/**
 * アプリのモデル
 */
class Model
{
    constructor()
    {
        this._score = 0;
        this._scene = 0;

        this._bg_img_no = 0;
        this._hit_se_no = 0;

        this._field_size_w = 800;
        this._field_size_h = 600;
    }

    Init()
    {
        canvasSize(this._field_size_w, this._field_size_h);

        lineW(3);

        loadImg(this._bg_img_no, "image/bg.jpg");
        loadSound(this._hit_se_no, "sound/se.mp3");
    }

    SetScore(in_score)
    {
        this._score = in_score;
    }

    SetScene(in_scene)
    {
        this._scene = in_scene;
    }
}

/**
 * アプリのコントローラーとビュー
 */
class ControllerAndView
{
    constructor()
    {
        this._player_bar = new PlayerBar();
        this._ball = new Ball();
        this._field = new Field();
    }

    Init(in_model)
    {
        this._model = in_model;
        this._field.Init(this._model._field_size_w, this._model._field_size_h);
    }

    Update()
    {
        switch (this._model._scene)
        {
            case 0:
            {
                if (tapC == 1)
                {
                    this._player_bar.Init(this._field._size_w * 0.5, this._field._size_h * 0.875);
                    this._ball.Init(this._field._size_w * 0.5, this._field._size_h * 0.375);

                    this._model.SetScene(1);
                    this._model.SetScore(0);
                }

                break;
            }
            case 1:
            {
                this._ball.Move();

                if (this._field.HitFieldLeftLine(this._ball._x) || this._field.HitFieldRightLine(this._ball._x))
                    this._ball.SetXVec(-this._ball._x_vec);

                if (this._field.HitFieldTopLine(this._ball._y))
                    this._ball.SetYVec(8 + rnd(8));

                this._player_bar.SetX(tapX);

                var min_x = this._field._size_w * 0.25;
                var max_x = this._field._size_w * 0.75;
                if (this._player_bar.GetX(0) < min_x) this._player_bar.SetX(min_x);
                if (this._player_bar.GetX(0) > max_x) this._player_bar.SetX(max_x);

                if (this._ball._y >= this._field._size_h)
                {
                    tapC = 0;
                    this._model.SetScene(2);
                }
                else
                if (this._player_bar.GetX(1) < this._ball._x && this._ball._x < this._player_bar.GetX(2))
                {
                    if (this._player_bar.GetY(1) < this._ball._y && this._ball._y < this._player_bar.GetY(2))
                    {
                        this._ball.SetYVec(-8 - rnd(8));
                        this._model.SetScore(this._model._score + 100);
                        playSE(this._model._hit_se_no);
                    }
                }

                break;
            }

            case 2:
            {
                if (tapC == 1)
                {
                    this._model.SetScene(0);
                    tapC = 0;
                }
                break;
            }
        }
    }

    Draw()
    {
        drawImg(0, 0, 0);
        this._field.Draw();
        this._ball.Draw();
        this._player_bar.Draw();

        fText("SCORE" + this._model._score, this._field._size_w * 0.5, this._field.size_h * 0.03125, 36, "white");
        switch (this._model._scene)
        {
            case 0:
            {
                fText("Squash Game", this._field._size_w * 0.5, this._field._size_h * 0.25, 48, "cyan");
                fText("Click to start", this._field._size_w * 0.5, this._field._size_h * 0.75, 36, "gold");

                break;
            }
            case 2:
            {
                fText("GAME OVER", this._field._size_w * 0.5, this._field._size_h * 0.5, 36, "red");
                break;
            }
        }
    }
}

var model = new Model();
var contoller = new ControllerAndView();

// セットアップ処理
function setup()
{
    model.Init();
    contoller.Init(model);
}

/**
 * メインループ
 */
function mainloop()
{
    contoller.Draw();
    contoller.Update();
}
