/**
 * ミサイル管理
 */
class MissleManager
{
    constructor(in_max_count)
    {
        this._msl = new Array(in_max_count);
        this._src_w = 0;
        this._src_h = 0;
        this._effect_mng = null;

        this._obj_map = {
            "s01": {
                type: 0,
                img_no: 2
            },
            "e01": {
                type: 1,
                img_no: 3
            }
        }
    }

    Init(in_src_w, in_src_h, in_effect_mng)
    {
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._effect_mng = in_effect_mng;

        for (var i = 0; i < this._msl.length; ++i)
            this._msl[i] = null;
    }

    Fire(in_x, in_y, in_xp, in_yp, in_type_name)
    {
        let obj_data = this._obj_map[in_type_name];
        for (let i = 0; i < this._msl.length; ++i)
        {
            if (this._msl[i] != null)
                continue;

            let obj = null;
            switch (obj_data.type)
            {
                case 0: {
                    obj = new Missle();
                    break;
                }
                case 1: {
                    obj = new MissleEnemy();
                    break;
                }
            }

            obj.Init(
                in_x,
                in_y,
                obj_data.img_no,
                this._src_w,
                this._src_h,
                in_type_name);
            obj.Fire(in_xp, in_yp);
            this._msl[i] = obj;

            return;
        }
    }

    ToArray()
    {
        let array = new Array();
        for (let i = 0; i < this._msl.length; ++i)
        {
            if (this._msl[i] == null)
                continue;

            array.push(this._msl[i]);
        }

        return array;
    }

    Update(in_game_timer)
    {
        let obj = null;
        for (var i = 0; i < this._msl.length; ++i)
        {
            obj = this._msl[i];
            if (obj == null)
                continue;

            obj.Update(in_game_timer);
            if (!obj.IsDel)
                continue;

            this._msl[i] = null;
        }
    }

    Draw()
    {
        for (var i = 0; i < this._msl.length; ++i)
        {
            if (this._msl[i] == null)
                continue;

            this._msl[i].Draw();
        }
    }
}

/**
 * ミサイルクラス
 */
class Missle extends PawnObject
{
    get TypeName() { return this._type_name; }

    constructor()
    {
        super();

        this._mslXp = 0;
        this._mslYp = 0;
        this._src_w = 0;
        this._src_h = 0;
        this._type_name = "";
    }

    Init(
        in_x,
        in_y,
        in_img_no,
        in_src_w,
        in_src_h,
        in_type_name)
    {
        super.Init(in_x, in_y, in_img_no, 30);
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._type_name = in_type_name;
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

        if (this._ssX < -100)
            this._b_del = true;
        else if (this._ssX > this._src_w + 100)
            this._b_del = true;

        if (this._ssY < -100)
            this._b_del = true;
        else if (this._ssY > this._src_h + 100)
            this._b_del = true;
    }

    Draw()
    {
        super.Draw();
    }
}

/**
 * 敵ミサイル
 */
class MissleEnemy extends Missle
{
    EventHit(in_hit_obj)
    {
        if (!(in_hit_obj instanceof MissleEnemy))
            return;

        this.Destory();
    }
}