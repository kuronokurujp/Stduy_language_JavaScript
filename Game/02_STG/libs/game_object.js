/**
 * ゲームオブジェクト
 */
class GameObject
{
    constructor()
    {
        this._ssX = 0;
        this._ssY = 0;
        this._b_del = true;
    }

    get X() { return this._ssX; }
    get Y() { return this._ssY; }
    get IsDel() { return this._b_del; }

    Init(in_x, in_y)
    {
        this._ssX = in_x;
        this._ssY = in_y;
        this._b_del = false;
    }

    Destory()
    {
        this._b_del = true;
    }

    SetPosition(in_x, in_y)
    {
        this._ssX = in_x;
        this._ssY = in_y;
    }

    AddPosition(in_vx, in_vy)
    {
        this._ssX += in_vx;
        this._ssY += in_vy;
    }

    Update(in_game_timer) {}
    Draw() {}
}

/**
 * Pawnオブジェクト
 */
class PawnObject extends GameObject
{
    get Radius() { return this._radius; }

    constructor()
    {
        super();

        this._radius = 0;
        this._image_no = -1;
    }

    Init(in_x, in_y, in_img_no, in_radius)
    {
        super.Init(in_x, in_y);
        this._image_no = in_img_no;
        this._radius = in_radius;
    }

    Draw()
    {
        if (this._b_del)
            return;

        drawImgC(this._image_no, this._ssX, this._ssY);
    }

    Hit(in_obj)
    {
        let dis = getDis(in_obj.X, in_obj.Y, this.X, this.Y);
        if (dis > (this.Radius + in_obj.Radius))
            return false;

        return true;
    }

    EventHit(in_hit_obj) {}
}

/**
 * GameObjectの管理
 */
class GameObjectManager
{
    constructor(in_max_count)
    {
        this._obj = new Array(in_max_count);
        {
            for (let i = 0; i < in_max_count; ++i)
                this._obj[i] = null;
        }
    }

    Push(in_obj)
    {
        for (let i = 0; i < this._obj.length; ++i)
        {
            if (this._obj[i] != null)
                continue;

            this._obj[i] = in_obj;
            return;
        }
    }

    Update(in_game_timer)
    {
        for (let i = 0; i < this._obj.length; ++i)
        {
            if (this._obj[i] == null)
                continue;

            this._obj[i].Update(in_game_timer);
            if (this._obj[i].IsDel)
                this._obj[i] = null;
        }
    }

    Draw()
    {
        for (let i = 0; i < this._obj.length; ++i)
        {
            if (this._obj[i] == null)
                continue;

            this._obj[i].Draw();
        }
    }

    ToArray()
    {
        let array = new Array();
        for (let i = 0; i < this._obj.length; ++i)
        {
            if (this._obj[i] == null)
                continue;

            array.push(this._obj[i]);
        }

        return array;
    }
}