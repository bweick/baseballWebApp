# -*- coding: utf-8 -*-
"""
Created on Mon Oct 31 18:00:39 2016

@author: Brian
"""

import numpy as np
import requests as r
import scipy.stats as st

def make_dist(assump):
    air = 1/(1+assump['gbfb'])
    gb = 1 - air
    if assump['hr_rate'] + assump['bb_rate'] + assump['so_rate'] + assump['ip_rate'] > 1:
            assump['ip_rate'] = assump['ip_rate']-(assump['hr_rate'] + assump['bb_rate'] + assump['so_rate'] + assump['ip_rate']-1)

    #apportion iffb away from fd and ld according to their ratio of occurence
    fbif = ((air-assump['ld_rate'])/air)*assump['iffb']*air
    ldif = (assump['ld_rate']/air)*assump['iffb']*air
    true_fb = air-assump['ld_rate']-fbif
    fbpa = true_fb*assump['ip_rate']
    gbpa = gb*assump['ip_rate']
    ldpa = (assump['ld_rate']-ldif)*assump['ip_rate']
    inf = air*assump['iffb']*assump['ip_rate']

    outcomes = [gbpa, inf, ldpa, fbpa, assump['hr_rate'], assump['so_rate'], assump['bb_rate']]
    outcomes.append(1-np.sum(outcomes))
    return outcomes

def sim_season(url, profile):
    #link = 'http://localhost:8000/api/?url=' + url
    link = 'https://baseballstatview.herokuapp.com/api/api/?url=' + url
    response = r.get(link, auth=('brian', 'baseball56'))
    response = response.json()
    if profile == 'current':
        for i in range(len(response)):
            if response[i]['year'] == 2016:
                assump = {'hr_rate':response[i]['hr_rate']/100, 'ld_rate':response[i]['ld_rate']/100, 'bb_rate':response[i]['bb_rate']/100,
                          'so_rate':response[i]['so_rate']/100, 'gbfb':response[i]['gbfb'], 'ip_rate':response[i]['ip_rate']/100, 'iffb':response[i]['iffb']/100}
    else:
        mat = np.zeros((len(response), 7))
        pas = []
        for i in range(len(response)):
            mat[i,0] = response[i]['ld_rate']
            mat[i,1] = response[i]['hr_rate']
            mat[i,2] = response[i]['so_rate']
            mat[i,3] = response[i]['bb_rate']
            mat[i,4] = response[i]['gbfb']
            mat[i,5] = response[i]['ip_rate']
            mat[i,6] = response[i]['iffb']
            pas.append(response[i]['pa'])
        pa_weights = pas/np.sum(pas)
        if profile == 'avg':
            out = pa_weights.dot(mat)
            assump = {'hr_rate':out[1]/100, 'ld_rate':out[0]/100, 'bb_rate':out[3]/100, 'so_rate':out[2]/100, 'gbfb':out[4], 'ip_rate':out[5]/100, 'iffb':out[6]/100}
        elif profile == 'wavg':
            #yr_weights =
            print(yr_weights)
            out = pa_weights.dot(mat)
            assump = {'hr_rate':out[1]/100, 'ld_rate':out[0]/100, 'bb_rate':out[3]/100, 'so_rate':out[2]/100, 'gbfb':out[4], 'ip_rate':out[5]/100, 'iffb':out[6]/100}

    outcomes = make_dist(assump)

    master = {}
    running = []
    lst_obp, lst_ba, lst_babip = [], [], []
    min_obp, min_ba, min_babip = [], [], []
    for j in range(50):
        ba_i, obp_i, pbp, babip_i, xbabip_i = [], [], [], [], []
        hits, h, walk, ab, ip, hr = 0, 0, 0, 0, 0, 0
        gb, ld, fb = 0, 0, 0
        for i in range(600):
            outcome = np.random.multinomial(1, outcomes)
            if outcome[0] == 1:
                h = np.random.binomial(1, .239)
                ab += 1
                ip += 1
                gb +=1
            elif outcome[1] == 1:
                h = 0
                ab += 1
                ip += 1
            elif outcome[2] == 1:
                h = np.random.binomial(1,.685)
                ab += 1
                ip += 1
                ld += 1
            elif outcome[3] == 1:
                h = np.random.binomial(1,.207)
                ab += 1
                ip += 1
                fb += 1
            elif outcome[4] == 1:
                h = 1
                hr += 1
                ab += 1
            elif outcome[5] == 1:
                h = 0
                ab += 1
            elif outcome[6] == 1:
                h = 0
                walk += 1
            elif outcome[7] == 1:
                h = 0
                ab += 1
                ip += 1

            hits += h
            ob = hits+walk

            if ab == 0:
                ba_i.append(0)
            else:
                ba_i.append(round(hits/ab, 3))

            obp_i.append(round(ob/(i+1), 3))

            if ip == 0:
                babip_i.append(0)
            else:
                babip_i.append(round((hits-hr)/ip, 3))

            if ip == 0:
                xbabip_i.append(0)
            else:
                xbabip_i.append(round((gb*.24+ld*.73+fb*.18)/ip, 3))

            if i == 599:
                lst_obp.append(round(ob/(i+1), 3))
                lst_ba.append(round(hits/ab, 3))
                lst_babip.append(round((hits-hr)/ip, 3))
            pbp.append({'type':list(outcome).index(1), "hit":h})

        if j < 50:
            running.append({})
            running[j].update({"obp":obp_i})
            running[j].update({"ba":ba_i})
            running[j].update({"babip":babip_i})
            running[j].update({"pbp":pbp})
            running[j].update({"xbabip":xbabip_i})
            min_obp.append(min(obp_i[150:]))
            min_ba.append(min(ba_i[150:]))
            min_babip.append(min(babip_i[150:]))

    sum_stat = {'mean_ba':round(np.mean(lst_ba), 3), 'std_ba':round(np.std(lst_ba),4), 'rng_ba':'['+str(min(lst_ba))+', '+str(max(lst_ba))+']',
                'mean_obp':round(np.mean(lst_obp), 3), 'std_obp':round(np.std(lst_obp),4), 'rng_obp':'['+str(min(lst_obp))+', '+str(max(lst_obp))+']',
                'mean_babip':round(np.mean(lst_babip), 3), 'std_babip':round(np.std(lst_babip),4), 'rng_babip':'['+str(min(lst_babip))+', '+str(max(lst_babip))+']',
                'min_obp':min(min_obp), 'min_ba':min(min_ba), 'min_babip':min(min_babip)}

    for k in range(len(running)):
        running[k].update({"pct_ba":round(st.norm.cdf((running[k]['ba'][-1]-sum_stat['mean_ba'])/sum_stat['std_ba']),3)})
        running[k].update({"pct_obp":round(st.norm.cdf((running[k]['obp'][-1]-sum_stat['mean_obp'])/sum_stat['std_obp']),3)})
        running[k].update({"pct_babip":round(st.norm.cdf((running[k]['babip'][-1]-sum_stat['mean_babip'])/sum_stat['std_babip']),3)})

    x0 = np.linspace(sum_stat['min_ba']-.05,sum_stat['min_ba']+.25, 300)
    x1 = np.linspace(sum_stat['min_obp']-.05,sum_stat['min_obp']+.25, 300)
    x2 = np.linspace(sum_stat['min_babip']-.05,sum_stat['min_babip']+.25, 300)

    freq_ba = st.norm.pdf(x0, sum_stat['mean_ba'], sum_stat['std_ba'])
    freq_obp = st.norm.pdf(x1, sum_stat['mean_obp'], sum_stat['std_obp'])
    freq_babip = st.norm.pdf(x2, sum_stat['mean_babip'], sum_stat['std_babip'])

    norm_ba, norm_obp, norm_babip = [], [], []
    for i in range(len(freq_ba)):
        norm_ba.append({'x':x0[i], 'y':freq_ba[i]})
        norm_obp.append({'x':x1[i], 'y':freq_obp[i]})
        norm_babip.append({'x':x2[i], 'y':freq_babip[i]})

    freq = [{'freq_ba':norm_ba, 'freq_obp':norm_obp, 'freq_babip':norm_babip}]

    master = {'lines':running, 'sum':sum_stat, 'freq':freq}
    return master

if __name__ == "__main__":
    sim_season('blackch02', 'current')
