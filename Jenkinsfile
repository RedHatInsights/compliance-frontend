/*
 * Requires: https://github.com/RedHatInsights/insights-pipeline-lib
 */

@Library("github.com/RedHatInsights/insights-pipeline-lib") _

node {
    cancelPriorBuilds()
    scmVars = checkout scm

    if (env.BRANCH_NAME == 'master' && scmVars.GIT_COMMIT != scmVars.GIT_PREVIOUS_SUCCESSFUL_COMMIT) {
        runStages()
    }
}

def runStages() {
    openShift.withUINode {
        stageWithContext("Install-integration-tests-env") {
            sh "pip install ibutsu-pytest-plugin"
            sh "iqe plugin install compliance"
        }

        stageWithContext("Inject-credentials-and-settings") {
            withCredentials([
                file(credentialsId: "compliance-settings-credentials-yaml", variable: "creds"),
                file(credentialsId: "compliance-settings-local-yaml", variable: "settings")]
            ) {
                sh "cp \$creds \$IQE_VENV/lib/python3.6/site-packages/iqe_compliance/conf"
                sh "cp \$settings \$IQE_VENV/lib/python3.6/site-packages/iqe_compliance/conf"
            }
        }

        stageWithContext("Run-integration-tests") {
            withEnv(['ENV_FOR_DYNACONF=ci', 'REQUESTS_CA_BUNDLE=/etc/pki/tls/certs/ca-bundle.crt']) {
               sh "iqe tests plugin compliance -v -s -k test_navigate_smoke --junitxml=junit.xml -o ibutsu_server=https://ibutsu-api.cloud.paas.psi.redhat.com/"    
            }

            junit "junit.xml"
        }
    }
}
