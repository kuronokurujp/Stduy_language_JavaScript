/**
 * 敵丸ごと管理
 */
class EnemyManager
{
    constructor(in_max_count)
    {
        this._obj = new Array(in_max_count);
        {
            for (let i = 0; i < in_max_count; ++i)
                this._obj[i] = null;
        }

        this._src_w = 0;
        this._src_h = 0;

        this._obj_map = {
            "e01": {type: 0, img_no: 4}
        }

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
     * @param {*} in_type_name 
     * @returns 
     */
    Create(in_x, in_y, in_type_name)
    {
        for (let i = 0; i < this._obj.length; ++i)
        {
            if (this._obj[i] != null)
                continue;

            let obj = null;
            let obj_data = this._obj_map[in_type_name];
            switch (obj_data.type)
            {
                case 0: {
                    obj = new Enemy01();
                    break;
                }
            }
            obj.Init(
                in_x,
                in_y,
                obj_data.img_no,
                this._src_w,
                this._src_h,
                this._missle_mng,
                this._effect_mng);

            this._obj[i] = obj;
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

/**
 * 敵ベース
 */
class EnemyBase extends PawnObject
{
    constructor()
    {
        super();

        this._src_w = 0;
        this._src_h = 0;
        this._missle_mng = null;
        this._effect_mng = null;
    }

    Init(
        in_x, in_y, in_img_no, in_src_w, in_src_h, in_missle_mng, in_effect_mng)
    {
        super.Init(in_x, in_y, in_img_no, 30);
        this._src_w = in_src_w;
        this._src_h = in_src_h;
        this._missle_mng = in_missle_mng;
        this._effect_mng = in_effect_mng;
    }
}

/**
 * 敵１
 */
class Enemy01 extends EnemyBase
{
    Update(in_timer)
    {
        if (rnd(100) == 1)
        {
            this._missle_mng.Fire(
                this._ssX,
                this._ssY,
                -10, 0, "e01"
            )
        }
    }

    EventHit(in_hit_obj)
    {
        if (!(in_hit_obj instanceof Missle))
            return;

        if (in_hit_obj.TypeName != "s01")
            return;

        this._effect_mng.Fire(this._ssX, this._ssY, EffectType.Expload);

        this._b_del = true;
    }
}