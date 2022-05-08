/**
 * 敵タイプ一覧
 */
class EnemyType extends EnumBase
{
    static E01 = new EnemyType("01");
    static E02 = new EnemyType("02");
    static E03 = new EnemyType("03");
    static E04 = new EnemyType("04");
}

/**
 * 敵丸ごと管理
 */
class EnemyManager  extends GameObjectManager
{
    constructor(in_max_count)
    {
        super(in_max_count);

        this._src_w = 0;
        this._src_h = 0;

        this._missle_mng = null;
        this._effect_mng = null;
    }

    Init(in_src_w, in_src_h, in_missle_mng, in_effect_mng)
    {
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._missle_mng = in_missle_mng;
        this._effect_mng = in_effect_mng;
    }

    /**
     * オブジェクトの生成
     * @param {*} in_x 
     * @param {*} in_y 
     * @param {*} in_type 
     * @returns 
     */
    Create(in_x, in_y, in_type)
    {
        let obj = null;
        switch (in_type.Name)
        {
            // 直線移動の敵
            case EnemyType.E01.Name: {
                obj = new Enemy01(1);
                break;
            }
            // バウンド移動する敵
            case EnemyType.E02.Name: {
                obj = new Enemy02(2);
                break;
            }
            // 弾撃って逃げる敵
            case EnemyType.E03.Name: {
                obj = new Enemy03(1);
                break;
            }
            // 死なない敵
            case EnemyType.E04.Name: {
                obj = new Enemy04(-1);
                break;
            }
        }

        obj.Init(
            in_x,
            in_y,
            this._src_w,
            this._src_h,
            this._missle_mng,
            this._effect_mng);

        this.Push(obj);
    }
}

/**
 * 敵ベース
 */
class EnemyBase extends PawnObject
{
    constructor(in_life)
    {
        super();

        this._src_w = 0;
        this._src_h = 0;
        this._missle_mng = null;
        this._effect_mng = null;
        this._life = in_life;
    }

    Init(
        in_x, in_y, in_src_w, in_src_h, in_missle_mng, in_effect_mng)
    {
        super.Init(in_x, in_y, this.ImgNo(), 0);
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._missle_mng = in_missle_mng;
        this._effect_mng = in_effect_mng;
    }

    Destory()
    {
        super.Destory();
    }

    Update()
    {
        if ((this.X < -100) || (this.X > this._src_w + 100))
            this.Destory();
        else if ((this.Y < -100) || (this.Y > this._src_h + 100))
            this.Destory();
    }

    ImgNo() { return 0; }

    EventHit(in_hit_obj)
    {
        if (in_hit_obj instanceof Missle)
        {
            if (in_hit_obj.IsTag(MissileType.Ship.Name))
            {
                this.ApplayDamage(1);
                return;
            }
        }

        if ((in_hit_obj instanceof Ship))
        {
            this.ApplayDamage(100);
            return;
        }
    }

    ApplayDamage(in_damage)
    {
        if (this._life == -1)
            return;

        this._life -= in_damage;
        let pos = new Vector2(this.X + rnd(30) - 15, this.Y + rnd(30) - 15);
        if (this._life <= 0) {
            this._effect_mng.Fire(pos.X, pos.Y, EffectType.Expload);
            this.Destory();
        }
        else
        {
            this._effect_mng.Fire(pos.X, pos.Y, EffectType.LittleExpload);
        }
    }
}

/**
 * 敵１
 */
class Enemy01 extends EnemyBase
{
    static ImgFilePath() { return "image/enemy1.png"; }
    static ImgNo() { return 4; }

    get Radius() { return 50; }

    ImgNo() { return Enemy01.ImgNo(); }

    Update(in_timer)
    {
        super.Update(in_timer);

        this.AddPosition(-10, 0);
    }
}

/**
 * 敵2
 */
class Enemy02 extends EnemyBase
{
    static ImgFilePath() { return "image/enemy2.png"; }
    static ImgNo() { return 6; }

    get Radius() { return 80; }

    constructor(in_life)
    {
        super(in_life);
        this._base_vec = new Vector2(8, 8);
        this._vec = new Vector2(-this._base_vec.x, -this._base_vec.y);
    }

    ImgNo() { return Enemy02.ImgNo(); }

    Update(in_timer)
    {
        super.Update(in_timer);

        let size = 60;
        let top_y = this.Y - size / 2;
        let bottom_y = this.Y + size / 2;
        if (top_y <= 0)
            this._vec.y = this._base_vec.y;
        else if (bottom_y >= this._src_h)
            this._vec.y = -this._base_vec.y;

        this.AddPosition(this._vec.x, this._vec.y);
    }
}

/**
 * 敵3
 */
class Enemy03 extends EnemyBase
{
    static ImgFilePath() { return "image/enemy3.png"; }
    static ImgNo() { return 7; }

    get Radius() { return 100; }

    constructor(in_life)
    {
        super(in_life);

        this._vec = new Vector2(-8, 0);
        this._state = 0;
    }

    ImgNo() { return Enemy03.ImgNo(); }

    Update(in_timer)
    {
        super.Update(in_timer);
        switch (this._state)
        {
            case 0: {
                this._vec.x *= 0.95;
                if ((int)(this._vec.x) == 0)
                {
                    this._vec.x = 8;
                    this._missle_mng.Fire(this.X, this.Y, -3, 0, MissileType.ME01);
                    ++this._state;
                }
                break;
            }

            case 1: {
                break;
            }
        }

        this.AddPosition(this._vec.x, this._vec.y);
    }
}

/**
 * 敵4
 */
class Enemy04 extends EnemyBase
{
    static ImgFilePath() { return "image/enemy4.png"; }
    static ImgNo() { return 8; }

    get Radius() { return 128; }

    ImgNo() { return Enemy04.ImgNo(); }

    Update(in_timer)
    {
        super.Update(in_timer);
        this.AddPosition(-1, 0);
    }

    EventHit(in_hit_obj)
    {
        if (!(in_hit_obj instanceof Missle))
            return;

        if (in_hit_obj.IsTag(MissileType.Ship.Name))
            this._effect_mng.Fire(this.X, this.Y, EffectType.LittleExpload);
    }
}