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
    openShift.withUINode(cloud: "cmqe", workingDir: "/tmp") {
        stage("Install-integration-tests-env") {
            withStatusContext.custom(env.STAGE_NAME, true) {
                sh "iqe plugin install compliance"
            }
        }

        stage("Inject-credentials-and-settings") {
            withCredentials([
                file(credentialsId: "compliance-settings-credentials-yaml", variable: "creds"),
                file(credentialsId: "compliance-settings-local-yaml", variable: "settings")]
            ) {
                withStatusContext.custom(env.STAGE_NAME, true) {
                    sh "cp \$creds \$IQE_VENV/lib/python3.6/site-packages/iqe_compliance/conf"
                    sh "cp \$settings \$IQE_VENV/lib/python3.6/site-packages/iqe_compliance/conf"
                }
            }
        }

        stage("Run-integration-tests") {
            withStatusContext.custom(env.STAGE_NAME, true) {
                withEnv(['ENV_FOR_DYNACONF=ci']) {
                   sh "iqe tests plugin compliance -v -s -k test_navigate_smoke --junitxml=junit.xml"    
                }
            }

            junit "junit.xml"
        }
    }
}
