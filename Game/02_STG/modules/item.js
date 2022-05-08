class ItemType extends EnumBase
{
    static CureEnergy = new ItemType("01");
    static PlusBullet = new ItemType("02");
    static ChangeLaser = new ItemType("03");
}

/**
 * アイテム管理
 */
class ItemManager extends GameObjectManager
{
    /**
     * アイテム生成
     */
    Create(in_type, in_pos, in_vec, in_src, in_effect_mng) {
        let obj = null;
        switch (in_type.Name)
        {
            case ItemType.ChangeLaser.Name: {
                obj = new ItemChangeLaser();
                break;
            }
            case ItemType.CureEnergy.Name: {
                obj = new ItemCureEnergy();
                break;
            }
            case ItemType.PlusBullet.Name: {
                obj = new ItemPlusBullet();
                break;
            }
        }
        obj.Init(in_pos, in_vec, in_src, in_effect_mng);
        this.Push(obj);
    }
}

/**
 * アイテム基本クラス
 */
class ItemBase extends PawnObject
{
    constructor() {
        super();

        this._src_rect = new Rect2D(); 
        this._vec = new Vector2();
        this._effect_mng = null;
    }

    Init(
        in_pos, in_vec, in_src_rect, in_effect_mng)
    {
        super.Init(in_pos.x, in_pos.y, this.ImgNo(), 32);
        this._src_rect.Copy(in_src_rect);
        this._vec.Copy(in_vec);
        this._effect_mng = in_effect_mng;
    }

    Update(in_game_timer)
    {
        this.AddPosition(this._vec.X, this._vec.Y);
        if (!this._src_rect.CheckByInsidePoint(this._pos))
            this.Destory();
    }

    EventHit(in_hit_obj) {
        if (in_hit_obj instanceof Ship)
            this.Destory();
    }
}

/**
 * エネルギー回復
 */
class ItemCureEnergy extends ItemBase
{
    static ImgFilePath() { return "image/item0.png"; }
    static ImgNo() { return 20; }

    ImgNo() { return ItemCureEnergy.ImgNo(); }
}

/**
 * 発射弾を増やす
 */
class ItemPlusBullet extends ItemBase
{
    static ImgFilePath() { return "image/item1.png"; }
    static ImgNo() { return 21; }

    ImgNo() { return ItemPlusBullet.ImgNo(); }
}

/**
 * レーザーが撃てる
 */
class ItemChangeLaser extends ItemBase
{
    static ImgFilePath() { return "image/item2.png"; }
    static ImgNo() { return 22; }

    ImgNo() { return ItemChangeLaser.ImgNo(); }
}
