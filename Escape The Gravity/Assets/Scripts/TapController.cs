using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

[RequireComponent(typeof(Rigidbody2D))]
public class TapController : MonoBehaviour {

    public delegate void PlayerDelegate();
    public static event PlayerDelegate OnPlayerDied;
    public static event PlayerDelegate OnPlayerScored;

    public float tapForce = 1000;
    public float tiltSmooth = 2;
    public Vector3 startPos;
    
    public AudioSource hitAudio;
    public AudioSource scoreAudio;

    Rigidbody2D rigidbody;
    Quaternion downRotation;
    Quaternion forwardRotation;

    GameManager game;

    void Start() {
        rigidbody = GetComponent <Rigidbody2D>();
        downRotation = Quaternion.Euler(0, 0, -25);
        forwardRotation = Quaternion.Euler(0, 0, 25);
        game = GameManager.Instance;
    }

    void OnEnable()
    {
        GameManager.OnGameStarted += OnGameStarted;
        GameManager.OnGameOverConfirmed += OnGameOverConfirmed;
    }

    void OnDisable()
    {
        GameManager.OnGameStarted -= OnGameStarted;
        GameManager.OnGameOverConfirmed -= OnGameOverConfirmed;
    }

    void OnGameStarted()
    {
        rigidbody.velocity = Vector3.zero;
        rigidbody.simulated = true;
    }

    void OnGameOverConfirmed()
    {
        transform.localPosition = startPos;
        transform.rotation = Quaternion.identity;
    }

    void Update() {
        if (game.GameOver)
        {
            return;
        }
        if (Input.GetMouseButtonDown(0) || Input.GetKeyDown("space") || Input.GetKeyDown(KeyCode.UpArrow)) {
            transform.rotation = forwardRotation;
            rigidbody.velocity = Vector3.zero;
            rigidbody.AddForce(Vector2.up * tapForce, ForceMode2D.Force);
        }

        transform.rotation = Quaternion.Lerp(transform.rotation, downRotation, tiltSmooth * Time.deltaTime);
    }

    void OnTriggerEnter2D(Collider2D col) {
        if (col.gameObject.tag == "ScoreZone") {
            OnPlayerScored();
            scoreAudio.Play();
        }

        if (col.gameObject.tag == "DeadZone") {
            rigidbody.simulated = false;
            OnPlayerDied();
            hitAudio.Play();
        }
    }
}
