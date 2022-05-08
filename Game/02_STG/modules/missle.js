/**
 * ミサイルタイプ一覧
 */
class MissileType extends EnumBase
{
    static MS01 = new MissileType("01");
    static MS02 = new MissileType("03");
    static ME01 = new MissileType("02");

    static Ship = new MissileType("Ship");
    static Enemy = new MissileType("Enemy");
}

/**
 * ミサイル管理
 */
class MissleManager extends GameObjectManager
{
    constructor(in_max_count)
    {
        super(in_max_count);

        this._src_w = 0;
        this._src_h = 0;
        this._effect_mng = null;
    }

    Init(in_src_w, in_src_h, in_effect_mng)
    {
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._effect_mng = in_effect_mng;
    }

    Fire(in_x, in_y, in_xp, in_yp, in_type)
    {
        let obj = null;
        switch (in_type._name)
        {
            case MissileType.MS01.Name: {
                obj = new MissileShip();
                break;
            }
            case MissileType.ME01.Name: {
                obj = new MissileEnemy();
                break;
            }
            case MissileType.MS02.Name: {
                obj = new MissleLaserShip();
                break;
            }
        }

        obj.Init(
            in_x,
            in_y,
            this._src_w,
            this._src_h,
            in_type);
        obj.Fire(in_xp, in_yp);
        this.Push(obj);
    }
}

/**
 * ミサイルクラス
 */
class Missle extends PawnObject
{
    get Type() { return this._type; }

    constructor()
    {
        super();

        this._mslXp = 0;
        this._mslYp = 0;
        this._src_w = 0;
        this._src_h = 0;
        this._type = null;
    }

    Init(
        in_x,
        in_y,
        in_src_w,
        in_src_h,
        in_type)
    {
        super.Init(in_x, in_y, this.ImgNo(), 30);
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._type = in_type;
    }

    Fire(in_xp, in_yp)
    {
        this._mslXp = in_xp;
        this._mslYp = in_yp;
    }

    Update(in_game_timer)
    {
        super.Update(in_game_timer);
        this.AddPosition(this._mslXp, this._mslYp)

        if (this.X < -100)
            this._b_del = true;
        else if (this.X > this._src_w + 100)
            this._b_del = true;

        if (this._ssY < -100)
            this._b_del = true;
        else if (this.Y > this._src_h + 100)
            this._b_del = true;
    }

    Draw()
    {
        super.Draw();
    }

    ImgNo() { return 0; }
}

/**
 * 自機ミサイル
 */
class MissileShip extends Missle
{
    static ImgFilePath() { return "image/missile.png"; }
    static ImgNo() { return 2; }

    get Tag() { return MissileType.Ship.Name; }

    ImgNo() { return MissileShip.ImgNo(); }

    EventHit(in_hit_obj)
    {
        if (in_hit_obj instanceof Ship)
            return;

        this.Destory();
    }
}

/**
 * 自機レーザー
 */
class MissleLaserShip extends Missle
{
    static ImgFilePath() { return "image/laser.png"; }
    static ImgNo() { return 30; }

    get Tag() { return MissileType.Ship.Name; }

    ImgNo() { return MissleLaserShip.ImgNo(); }

    EventHit(in_hit_obj)
    {
        if (in_hit_obj instanceof Ship)
            return;
    }
}

/**
 * 敵ミサイル
 */
class MissileEnemy extends Missle
{
    static ImgFilePath() { return "image/enemy0.png"; }
    static ImgNo() { return 3; }

    ImgNo() { return MissileEnemy.ImgNo(); }

    EventHit(in_hit_obj)
    {
        if (in_hit_obj instanceof EnemyBase)
            return;

        this.Destory();
    }
}