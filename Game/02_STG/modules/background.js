/**
 * 背景
 */
class BG extends PawnObject
{
    constructor(in_screen_size)
    {
        super();

        this._spd = 0;
        this._bgX = 0;
        this._screen_size = new Vector2();
        this._screen_size.Copy(in_screen_size);
    }

//    get Width() { return this._width; }

    SetSpeedScroll(in_spd)
    {
        this._spd = in_spd;
    }

    Update(in_game_timer)
    {
        super.Update(in_game_timer);

        this._bgX = (this._bgX + this._spd) % this._screen_size.X;
    }

    Draw()
    {
        drawImg(0, -this._bgX, 0);
        drawImg(0, this._screen_size.X- this._bgX, 0);

        {
            var hy = this._screen_size.Y * 0.7;
            var ofsx = this._bgX % 40;
            lineW(2);
            for (let i = 1; i <= 30; ++i)
            {
                let tx = i * 40 - ofsx;
                let bx = i * 240 - ofsx * 6 - 3000;
                line(tx, hy, bx, this._screen_size.Y, "sliver");
            }

            for (let i = 1; i < 30; ++i)
            {
                lineW(1 + int(i / 3));
                line(0, hy, this._screen_size.X, hy, "gray");
                hy = hy + i * 2;
            }
        }

    }
}