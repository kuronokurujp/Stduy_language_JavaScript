/**
 * UIアイテムのベース
 */
class UIItemBase extends GameObject
{
}

/**
 * 
 */
class UIItemTimer extends GameObject
{
    constructor()
    {
        super();

        this._time_sec = 0;
    }

    SetSec(in_sec)
    {
        this._time_sec = in_sec;
    }

    Draw()
    {
        fText("Time:" + this._time_sec, this.X, this.Y, 50, "white");
    }
}

/**
 * ゲームクリア
 */
class UIItemGameClear extends UIItemBase
{
    Draw()
    {
        let text = "GAME CLEAR";
        let font_size = 50;
        fText(
            text,
            this.X,
            this.Y, font_size,
            "white");
    }
}

/**
 * ゲームオーバー
 */
class UIItemGameOver extends UIItemBase
{
    Draw()
    {
        let text = "GAME OVER";
        let font_size = 50;
        fText(
            text,
            this.X,
            this.Y, font_size,
            "red");
    }
}

/**
 * タイトル
 */
class UIItemTitle extends UIItemBase
{
    static ImgNo() { return 40; }
    static ImgFilePath() { return "image/title_ss.png"; }

    constructor()
    {
        super();

        this._b_text = false;
    }

    Update(in_game_timer)
    {
        this._b_text = ((in_game_timer % 2000) < 1000);
    }

    Draw()
    {
        drawImg(UIItemTitle.ImgNo(), this.X, this.Y);

        if (this._b_text)
            fText("Press [SPC] or Click to start.", this.X + 400, this.Y + 340, 40, "cyan");
    }
}

/**
 * 自機のエナジー表記
 */
class UIItemShipEnergy extends UIItemBase
{
    constructor() {
        super();
    }

    Init(in_x, in_y, in_max_energy)
    {
        super.Init(in_x, in_y);

        this._max_energy = in_max_energy;
        this._now_energy = in_max_energy;

    }

    SetEnergy(in_energy)
    {
        this._now_energy = in_energy;
    }

    Draw()
    {
        for (let i = 0; i < this._max_energy; ++i)
            fRect(this.X + i * 30, this.Y, 20, 40, "#c00000");

        for (let i = 0; i < this._now_energy; ++i)
            fRect(this.X + i * 30, this.Y, 20, 40, colorRGB(160 - 16 * i, 240 - 12 * i, 24 * i));
    }
}

/**
 * ミサイル発射モード
 */
class UIItemAutoMissle extends UIItemBase
{
    get Rect() { return this._rect; }

    constructor(in_rect)
    {
        super();
        this._rect = null;
        this._color = "black";
    }

    Init(in_rect)
    {
        super.Init(0, 0);
        this._rect = in_rect;
    }

    SetColor(in_col_name)
    {
        this._color = in_col_name;
    }

    Draw()
    {
        fRect(
            this._rect.Left,
            this._rect.Top,
            this._rect.Width,
            this._rect.Height,
            "blue");
        fText(
            "[A]uto Missile",
            this._rect.Left + this._rect.Width / 2,
            this._rect.Top + this._rect.Height / 2,
            36,
            this._color);
    }
}

/**
 * スコア表記
 */
class UIItemScore extends UIItemBase
{
    constructor()
    {
        super();
        this._score = 0;
        this._hiscore = 0;
    }

    SetScore(in_score)
    {
        this._score = in_score;
    }

    SetHIScore(in_score)
    {
        this._hiscore = in_score;
    }


    Draw()
    {
        fText("SCORE:"+ this._score, this.X, this.Y, 40, "white");
        fText("HISCORE:" + this._hiscore, this.X + 400, this.Y, 40, "yellow");
    }
}

/**
 * UIアイテム管理
 */
class UIItemManager extends GameObjectManager
{

}