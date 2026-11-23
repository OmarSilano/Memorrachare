pipeline {
    agent any

    environment {
        GIT_REPO_URL = 'git@github.com:OmarSilano/Memorrachare.git'
        DOCKER_IMAGE = 'jenkins-memory-builder:latest'
    }

    stages {
        stage('Node & Environment Checks') {
            steps {
                sh '''
                    echo "=== INFO NODO JENKINS E SHELL ==="
                    sh -c 'echo Shell OK'
                    uname -a
                    ls -la
                '''
            }
        }

        stage('Build Docker Agent') {
            steps {
                sh '''
                    echo "=== BUILD DELLA DOCKER IMAGE DELL'AGENT ==="
                    docker build -t ${DOCKER_IMAGE} .
                '''
            }
        }

        stage('Execute Build inside Container') {
            steps {
                withCredentials([sshUserPrivateKey(credentialsId: 'git-ssh-key-id', keyFileVariable: 'SSH_KEY_FILE')]) {
                    sh '''
                        echo "=== ESECUZIONE BUILD IN DOCKER ==="
                        SSH_KEY_CONTENT=$(cat $SSH_KEY_FILE)
                        docker run --rm \
                            -e SSH_PRIVATE_KEY="${SSH_KEY_CONTENT}" \
                            -e GIT_REPO_URL="${GIT_REPO_URL}" \
                            ${DOCKER_IMAGE}
                    '''
                }
            }
        }
    }

    post {
        success {
            echo '=== [JENKINS PIPELINE] BUILD COMPLETATA CON SUCCESSO! ==='
        }
        failure {
            echo '=== [JENKINS PIPELINE] BUILD FALLITA ==='
        }
    }
}