/**
 * エフェクトタイプ一覧
 */
class EffectType
{
    static Expload = new EffectType("Expload");
    static LittleExpload = new EffectType("LittleExpload");

    constructor(in_name) {
        this._name = in_name;
    }
}

class EffectBase extends GameObject
{
    constructor(in_type)
    {
        super();
        this._type = in_type;
    }

    Fire(in_x, in_y) {}
}

class EffectExploed extends EffectBase
{
    static ImgFilePath() { return "image/explode.png"; }
    static ImgNo() { return 5; }

    constructor(in_img_start_idx)
    {
        super(EffectType.Expload);
        this._img_idx = in_img_start_idx;
        this._img_length = 9;
    }

    Fire(in_x, in_y)
    {
        this._b_del = false;
        this._img_idx = this._img_length;
        this.SetPosition(in_x, in_y);
    }

    Draw()
    {
        if (this._b_del)
            return;

        drawImgTS(
            EffectExploed.ImgNo(), (this._img_length - this._img_idx) * 128,
            0, 128, 128,
            this.X - 64, this.Y - 64, 128, 128);

        --this._img_idx;
        if (this._img_idx < 0)
            this.Destory();
    }
}

/**
 * エフェクト管理
 */
class EffectManager extends GameObjectManager
{
    Fire(in_x, in_y, in_type)
    {
        let eff = null;
        switch (in_type._name) {
            case EffectType.Expload._name: {
                eff = new EffectExploed(0);
                break;
            }
            case EffectType.LittleExpload._name: {
                eff = new EffectExploed(6);
                break;
            }
        }

        eff.Fire(in_x, in_y);
        this.Push(eff);
    }
}