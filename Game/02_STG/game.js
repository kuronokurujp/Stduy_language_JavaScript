/**
 * 初期セットアップ
 * ゲーム開始前に一度だけ呼ばれる
 */
let g_begin_time = 0;
let g_game_contrller = null;
let g_fps = 60;

/**
 * 基本View
 */
class BaseView
{
    constructor(in_screen_size)
    {
        this._screen_size = in_screen_size;
    }

    Init(in_ui_mng) {}
    End() {}
    Update(in_timer) {}
    Draw() {}
}
/**
 * ゲーム全体のコントローラー
 */
class GameController
{
    constructor(in_model, in_timer)
    {
        this._model = in_model;
        this._ui_mng = new UIItemManager(10);

        this._gameover_view = new GameOverView(this._model.ScreenSize);
        this._gameclear_view = new GameClearView(this._model.ScreenSize);
        this._ingame_view = new InGameView(this._model.ScreenSize);
        this._title_view = new TitleView(this._model.ScreenSize);
        this._current_view = null;

        this._bg = new BG(this._model.ScreenSize);
        this._bg.Init(0, 0, 0);
        this._current_time = 0;
        this._b_stop_bgm = true;

        this.SetState(0, in_timer);
    }

    Update(in_timer)
    {
        switch (this._model.State)
        {
            // タイトル
            case 0: {
                if (tapC > 0)
                    this.SetState(1, in_timer);
                else if (key[32] > 0)
                    this.SetState(1, in_timer);

                break;
            }
            // メイン
            case 1: {

                if (this._b_stop_bgm === true)
                {
                    playBgm(0);
                    this._b_stop_bgm = false;
                }

                let ship_obj = this._current_view.GetShipObject();
                if (ship_obj.NowEnergy <= 0)
                {
                    this.SetState(3, in_timer);
                    break;
                }

                // ステージ時間設定
                let sec = int((in_timer - this._current_time) / 1000);
                {
                    this._current_view.SetStageTimeSec(sec);
                    if (sec > this._model.StageClearTimeSec)
                    {
                        this.SetState(2, in_timer);
                        break;
                    }
                }

                // 入力処理
                {
                    let ship_move_vec = new Vector2();
                    if (tapC > 0)
                    {
                        if (this._current_view.InsidePointByUIItemAutoMissle(
                            new Vector2(tapX, tapY)
                        ))
                        {
                            tapC = 0;
                        }
                        else 
                        {
                            ship_move_vec.Set(
                                tapX - ship_obj.X,
                                tapY - ship_obj.Y);
                        }
                    }
                    else
                    {
                        // 自動弾撃ちのスイッチ切り替え
                        if (key[65] == 1)
                        {
                            ++key[65];
                            this._current_view.ChangeAutoMisslelMode();
                        }

                        // 移動入力
                        {
                            if (key[37] > 0 && ship_obj.X > ship_obj.ImgW) 
                                ship_move_vec.x = -1;

                            if (key[39] > 0 && ship_obj.X < this._model.ScreenSize.X - ship_obj.ImgW)
                                ship_move_vec.x = 1;

                            if (key[38] > 0 && ship_obj.Y > ship_obj.ImgH)
                                ship_move_vec.y = -1;

                            if (key[40] > 0 && ship_obj.Y < this._model.ScreenSize.Y - ship_obj.ImgH)
                                ship_move_vec.y = 1;
                        }

                        // 弾を撃つキー
                        {
                            if (key[32] > 0)
                            {
                                key[32]++;
                                this._current_view.FireMissleByShip();
                            }
                        }
                    }

                    // 自機移動
                    {
                        if (Vector2.IsZero(ship_move_vec) === false)
                            this._current_view.MoveShip(ship_move_vec);
                    }
                }

                // 敵生成
                {
                    let start_pos = this._model.ScreenSize.X + 100;
                    if (4 <= sec)
                    {
                        if (in_timer % 20 === 0)
                            this._current_view.AddEnemyObject(new Vector2(start_pos, 60+rnd(600)), EnemyType.E01);
                    }

                    if (14 <= sec)
                    {
                        if (in_timer % 20 === 0)
                            this._current_view.AddEnemyObject(new Vector2(start_pos, 60+rnd(600)), EnemyType.E02);
                    }

                    if (24 <= sec)
                    {
                        if (in_timer % 60 === 0)
                            this._current_view.AddEnemyObject(new Vector2(start_pos, 360+rnd(360)), EnemyType.E03);
                    }

                    if (34 <= sec)
                    {
                        if (in_timer % 60 === 0)
                            this._current_view.AddEnemyObject(new Vector2(start_pos, rnd(720-192)), EnemyType.E04);
                    }
                }

                // アイテムを出す
                {
                    let put_item_rate = in_timer % 90;
                    let put_item_type = null;
                    if (put_item_rate === 0)
                        put_item_type = ItemType.CureEnergy;
                    else if (put_item_rate === 30)
                        put_item_type = ItemType.PlusBullet;
                    else if (put_item_rate === 60)
                        put_item_type = ItemType.ChangeLaser;

                    if (put_item_type != null)
                    {
                        let item_pos = new Vector2(this._model.LimitScreenRect.Right, 60 + rnd(600));
                        let item_vec = new Vector2(-2, 0);
                        this._current_view.AddItemObject(
                            put_item_type, item_pos, item_vec, this._model.LimitScreenRect
                        );
                    }
                }

                break;
            }
            // ゲームクリア
            case 2: {
                let now_time = (in_timer - this._current_time) / 1000;
                if (now_time > 5) {
                    this.SetState(0, in_timer);
                }

                break;
            }
            // ゲームオーバー
            case 3: {
                let now_time = (in_timer - this._current_time) / 1000;
                if (now_time > 5) {
                    this.SetState(0, in_timer);
                }

                break;
            }
        }

        this._bg.Update(in_timer);

        this._current_view.Update(in_timer);
        this._ui_mng.Update(in_timer);

        this._bg.Draw();
        this._current_view.Draw();
        this._ui_mng.Draw();
    }

    SetState(in_state, in_timer)
    {
        this._current_time = in_timer;
        if (this._current_view != null)
            this._current_view.End();

        this._model.SetState(in_state);
        switch (this._model.State)
        {
            case 0: {
                this._current_view = this._title_view;
                this._ui_mng.AllDestory();

                this._current_view.Init(this._ui_mng);
                break;
            }
            case 1: {
                this._current_view = this._ingame_view;
                this._ui_mng.AllDestory();

                this._bg.SetSpeedScroll(1);
                this._current_view.Init(this._ui_mng);
                break;
            }
            case 2: {
                this._current_view = this._gameclear_view;
                this._ui_mng.AllDestory();

                this._bg.SetSpeedScroll(0);
                this._current_view.Init(this._ui_mng);

                break;
            }
            case 3: {
                this._current_view = this._gameover_view;
                this._ui_mng.AllDestory();

                this._bg.SetSpeedScroll(0);
                this._current_view.Init(this._ui_mng);

                break;
            }
        }
    }
}

/**
 * 
 */
class GameModel
{
    get State() { return this._state; }
    get ScreenSize() { return this._screen_size; }
    get LimitScreenRect() { return this._limit_src_rect; }
    get StageClearTimeSec() { return this._stage_clear_time_sec; }

    constructor(in_width, in_height)
    {
        this._state = 0;
        this._screen_size = new Vector2(in_width, in_height);
        this._limit_src_rect = new Rect2D(-100, in_width + 100, -100, in_height + 100);
        this._stage_clear_time_sec = 120;

        // アセットロード
        {
            loadImg(0, "image/bg.png");
            loadImg(1, "image/spaceship.png");
            loadImg(MissileShip.ImgNo(), MissileShip.ImgFilePath());
            loadImg(MissileEnemy.ImgNo(), MissileEnemy.ImgFilePath());
            loadImg(Enemy01.ImgNo(), Enemy01.ImgFilePath());
            loadImg(Enemy02.ImgNo(), Enemy02.ImgFilePath());
            loadImg(Enemy03.ImgNo(), Enemy03.ImgFilePath());
            loadImg(Enemy04.ImgNo(), Enemy04.ImgFilePath());
            loadImg(EffectExploed.ImgNo(), EffectExploed.ImgFilePath());

            loadImg(ItemCureEnergy.ImgNo(), ItemCureEnergy.ImgFilePath());
            loadImg(ItemChangeLaser.ImgNo(), ItemChangeLaser.ImgFilePath());
            loadImg(ItemPlusBullet.ImgNo(), ItemPlusBullet.ImgFilePath());
            loadImg(MissleLaserShip.ImgNo(), MissleLaserShip.ImgFilePath());

            loadImg(UIItemTitle.ImgNo(), UIItemTitle.ImgFilePath());
        }
    }

    SetState(in_state)
    {
        this._state = in_state;
    }
}

/**
 * タイトルゲームView
 */
class TitleView extends BaseView
{
    Init(in_ui_mng)
    {
        super.Init(in_ui_mng);

        let title = new UIItemTitle();
        title.Init(200, 200);
        in_ui_mng.Push(title);
    }

    Update(in_timer) {}
    Draw() {}
}

/**
 * ゲームクリアView
 */
class GameClearView extends BaseView
{
    Init(in_ui_mng)
    {
        super.Init(in_ui_mng);
        
        let ui_item_gameclear = new UIItemGameClear();
        ui_item_gameclear.Init(this._screen_size.X / 2, this._screen_size.Y / 2);
        in_ui_mng.Push(ui_item_gameclear);
    }
}

/**
 * ゲームオーバーView
 */
class GameOverView extends BaseView
{
    Init(in_ui_mng)
    {
        super.Init(in_ui_mng);
        
        let ui_item_gameover = new UIItemGameOver();
        ui_item_gameover.Init(this._screen_size.X / 2, this._screen_size.Y / 2);
        in_ui_mng.Push(ui_item_gameover);
    }
}

/**
 * インゲームのView
 */
class InGameView extends BaseView
{
    static get OBJ_MAX() { return 100; }

    constructor(in_screen_size)
    {
        super(in_screen_size);

        this._width = in_screen_size.X;
        this._height = in_screen_size.Y;

        this._ship = new Ship();
        this._missle_mng = new MissleManager(InGameView.OBJ_MAX);
        this._enemy_mng = new EnemyManager(InGameView.OBJ_MAX);
        this._effect_mng = new EffectManager(InGameView.OBJ_MAX);
        this._item_mng = new ItemManager(InGameView.OBJ_MAX);

        this._ui_item_auto_missle = new UIItemAutoMissle();
        this._ui_item_ship_energy = new UIItemShipEnergy();
        this._ui_item_ship_score = new UIItemScore();
        this._ui_item_timer = new UIItemTimer();
    }

    Init(in_ui_mng)
    {
        super.Init(in_ui_mng);

        this._ship.Init(
            this._width * 0.05, this._height / 2, 1, 10, this._missle_mng, this._effect_mng);
        this._missle_mng.Init(
            this._width, this._height, this._effect_mng);
        this._enemy_mng.Init(
            this._width, this._height, this._missle_mng, this._effect_mng);

        // UI構築
        {
            this._ui_item_auto_missle.Init(new Rect2D(this._width - 280, this._width, 20, 20 + 60));
            in_ui_mng.Push(this._ui_item_auto_missle);

            this._ui_item_ship_energy.Init(20, this._height * 0.9, this._ship.MaxEnergy);
            in_ui_mng.Push(this._ui_item_ship_energy);

            this._ui_item_ship_score.Init(200, 50);
            in_ui_mng.Push(this._ui_item_ship_score);

            this._ui_item_timer.Init(this._width / 2, 100);
            in_ui_mng.Push(this._ui_item_timer);
        }
    }

    End()
    {
        this._missle_mng.AllDestory();
        this._enemy_mng.AllDestory();
        this._effect_mng.AllDestory();
        this._item_mng.AllDestory();
    }

    SetStageTimeSec(in_time_sec)
    {
        this._ui_item_timer.SetSec(in_time_sec);
    }

    Update(in_timer)
    {
        this._ship.Update(in_timer);
        this._missle_mng.Update(in_timer, this._width);
        this._enemy_mng.Update(in_timer);
        this._effect_mng.Update(in_timer);
        this._item_mng.Update(in_timer);
        {
            this._ui_item_auto_missle.SetColor("black");
            if (this._ship._automa === 1)
                this._ui_item_auto_missle.SetColor("white");
        }

        // ヒット判定処理
        {
            // 敵とミサイルとのヒット判定
            let missle_obj_array = this._missle_mng.ToArray();
            let enemy_obj_array = this._enemy_mng.ToArray();
            let ship_obj_array = [this._ship];
            let item_obj_array = this._item_mng.ToArray();
            // 敵と弾のヒット
            CheckHitPawnObjectArrayToPaanObjectArray(
                missle_obj_array, enemy_obj_array);
            // 自機と敵のヒット
            CheckHitPawnObjectArrayToPaanObjectArray(
                ship_obj_array, enemy_obj_array);
            // 自機と弾のヒット
            CheckHitPawnObjectArrayToPaanObjectArray(
                ship_obj_array, missle_obj_array);
            // 自機とアイテムのヒット
            CheckHitPawnObjectArrayToPaanObjectArray(
                ship_obj_array, item_obj_array);
        }
    }

    Draw()
    {
        this._ship.Draw();
        this._missle_mng.Draw();
        this._enemy_mng.Draw();
        this._effect_mng.Draw();
        this._item_mng.Draw();

        this._ui_item_ship_energy.SetEnergy(this._ship.NowEnergy);
    }

    InsidePointByUIItemAutoMissle(in_point)
    {
        let flg = this._ui_item_auto_missle.Rect.CheckByInsidePoint(in_point);
        if (flg) {
            this.ChangeAutoMisslelMode();
        }
        return flg;
    }

    ChangeAutoMisslelMode()
    {
        this._ship.ChangeAutoMisslelMode();
    }

    FireMissleByShip()
    {
        this._ship.FireSwitch();
    }

    MoveShip(in_vec)
    {
        in_vec.Normalize();
        in_vec = in_vec.GetByMulValue(this._ship.MoveSpeed);
        if (Vector2.IsZero(in_vec) === false)
            this._ship.AddPosition(in_vec.X, in_vec.Y);
    }

    GetShipObject() {
        return this._ship;
    }

    AddEnemyObject(in_pos, in_type)
    {
        this._enemy_mng.Create(in_pos.X, in_pos.Y, in_type);
    }

    AddItemObject(in_type, in_pos, in_vec, in_limit_src_rect)
    {
        this._item_mng.Create(in_type, in_pos, in_vec, in_limit_src_rect, this._effect_mng);
    }
}

function setup()
{
    g_begin_time = Date.now();
    let model = new GameModel(1200, 720);
    canvasSize(model.ScreenSize.X, model.ScreenSize.Y);
    g_game_contrller = new GameController(model, g_begin_time);

    loadSound(0, "sound/bgm.m4a");
    setFPS(g_fps);
}

/**
 * メイン処理
 */
function mainloop()
{
    let timer = Date.now() - g_begin_time;
    g_game_contrller.Update(timer);
}