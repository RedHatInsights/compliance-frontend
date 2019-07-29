/*
 * Requires: https://github.com/RedHatInsights/insights-pipeline-lib
 */

@Library("github.com/RedHatInsights/insights-pipeline-lib") _

node {
    cancelPriorBuilds()
    scmVars = checkout scm

    if (env.CHANGE_TARGET == "prod-stable") {
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
            withEnv([
                "ENV_FOR_DYNACONF=prod",
                "REQUESTS_CA_BUNDLE=/etc/pki/tls/certs/ca-bundle.crt",
                "DYNACONF_MAIN='@json {\"use_beta\":\"True\", \"dynaconf_merge\":\"True\"}'"
            ]) {
               sh "iqe tests plugin compliance -v -s -m compliance_ui --junitxml=junit.xml -o ibutsu_server=https://ibutsu-api.cloud.paas.psi.redhat.com/"    
            }

            junit "junit.xml"
        }
    }
}
