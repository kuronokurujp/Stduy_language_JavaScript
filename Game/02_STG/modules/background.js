/**
 * 背景
 */
class BG extends PawnObject
{
    constructor(in_width)
    {
        super();

        this._spd = 0;
        this._bgX = 0;
        this._width = in_width;
    }

    get Width() { return this._width; }

    SetSpeedScroll(in_spd)
    {
        this._spd = in_spd;
    }

    Update(in_game_timer)
    {
        super.Update(in_game_timer);

        this._bgX = (this._bgX + this._spd) % this._width;
    }

    Draw()
    {
        drawImg(0, -this._bgX, 0);
        drawImg(0, this._width - this._bgX, 0);
    }
}